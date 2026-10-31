using System.Runtime.Loader;
using MediaBrowser.Model.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Jellyfin.Plugin.Watchlist.Services;

/// <summary>
/// Registers the index.html transformation with the File Transformation plugin on server start.
/// </summary>
public class StartupTask : IScheduledTask, IConfigurableScheduledTask
{
    private const string TransformationId = "3fd831ef-acfb-493e-9857-d09d3cae7db5";

    private readonly ILogger<StartupTask> _logger;

    public StartupTask(ILogger<StartupTask> logger)
    {
        _logger = logger;
    }

    public string Name => "Watchlist: inject web UI";

    public string Key => "Jellyfin.Plugin.Watchlist.Startup";

    public string Description => "Injects the watchlist tab into the web UI using the File Transformation plugin.";

    public string Category => "Startup Services";

    public bool IsHidden => true;

    public bool IsEnabled => true;

    public bool IsLogged => false;

    public Task ExecuteAsync(IProgress<double> progress, CancellationToken cancellationToken)
    {
        var assembly = AssemblyLoadContext.All
            .SelectMany(context => context.Assemblies)
            .FirstOrDefault(a => a.FullName?.Contains(".FileTransformation", StringComparison.Ordinal) ?? false);

        var pluginInterface = assembly?.GetType("Jellyfin.Plugin.FileTransformation.PluginInterface");
        var register = pluginInterface?.GetMethod("RegisterTransformation");
        if (register is null)
        {
            _logger.LogWarning("Watchlist: plugin \"File Transformation\" not found. Without it the watchlist tab will not appear.");
            return Task.CompletedTask;
        }

        var payload = new JObject
        {
            { "id", TransformationId },
            { "fileNamePattern", "index.html" }, // must match other plugins exactly, otherwise File Transformation skips it
            { "callbackAssembly", typeof(TransformationPatches).Assembly.FullName },
            { "callbackClass", typeof(TransformationPatches).FullName },
            { "callbackMethod", nameof(TransformationPatches.IndexHtml) }
        };

        register.Invoke(null, new object?[] { payload });
        _logger.LogInformation("Watchlist: web UI injected via File Transformation.");
        progress.Report(100);
        return Task.CompletedTask;
    }

    public IEnumerable<TaskTriggerInfo> GetDefaultTriggers()
    {
        yield return new TaskTriggerInfo { Type = TaskTriggerInfoType.StartupTrigger };
    }
}
