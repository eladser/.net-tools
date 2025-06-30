// Enhanced .NET Version Comparison Data with Framework versions and .NET 10

const versionData = {
    netfx45: {
        name: '.NET Framework 4.5',
        releaseDate: 'August 2012',
        support: 'End of Support: January 2016',
        description: 'Major update with async/await support and significant performance improvements'
    },
    netfx472: {
        name: '.NET Framework 4.7.2',
        releaseDate: 'April 2018',
        support: 'Supported (Windows only)',
        description: 'Latest stable Framework release with .NET Standard 2.0 support'
    },
    netfx48: {
        name: '.NET Framework 4.8',
        releaseDate: 'April 2019',
        support: 'Supported (Windows only)',
        description: 'Final major release of .NET Framework with enhanced performance and security'
    },
    netfx481: {
        name: '.NET Framework 4.8.1',
        releaseDate: 'August 2022',
        support: 'Supported (Windows only)',
        description: 'Latest .NET Framework with accessibility improvements and ARM64 support'
    },
    net5: {
        name: '.NET 5.0',
        releaseDate: 'November 2020',
        support: 'End of Support: May 2022',
        description: 'Unified platform combining .NET Framework, .NET Core, and Xamarin'
    },
    net6: {
        name: '.NET 6.0',
        releaseDate: 'November 2021',
        support: 'LTS - End of Support: November 2024',
        description: 'Long Term Support release with significant performance improvements'
    },
    net7: {
        name: '.NET 7.0',
        releaseDate: 'November 2022',
        support: 'End of Support: May 2024',
        description: 'Focus on cloud-native development and performance'
    },
    net8: {
        name: '.NET 8.0',
        releaseDate: 'November 2023',
        support: 'LTS - Support until November 2026',
        description: 'Latest LTS release with AI/ML improvements and cloud optimizations'
    },
    net9: {
        name: '.NET 9.0',
        releaseDate: 'November 2024',
        support: 'Current - Support until May 2026',
        description: 'Latest release with enhanced performance and developer productivity'
    },
    net10: {
        name: '.NET 10.0',
        releaseDate: 'November 2025 (Preview)',
        support: 'Preview/RC - Full release November 2025',
        description: 'Next major release focusing on AI integration and cloud-native development'
    }
};

const versionComparisons = {
    'netfx45-netfx472': {
        title: '.NET Framework 4.5 to 4.7.2',
        majorChanges: [
            {
                title: '.NET Standard 2.0 Support',
                description: 'Added support for .NET Standard 2.0, enabling better code sharing across platforms.',
                code: `// .NET Standard 2.0 compatible library
// Can be used in .NET Framework 4.7.2, .NET Core, and .NET 5+
public class SharedLibrary
{
    public string GetPlatformInfo()
    {
        return System.Runtime.InteropServices.RuntimeInformation.OSDescription;
    }
}`
            },
            {
                title: 'Improved Cryptography',
                description: 'Enhanced cryptographic APIs with better security and performance.',
                code: `// Enhanced cryptography in 4.7.2
using System.Security.Cryptography;

public static byte[] HashData(byte[] data)
{
    using (var sha256 = SHA256.Create())
    {
        return sha256.ComputeHash(data);
    }
}`
            },
            {
                title: 'Enhanced Garbage Collection',
                description: 'Improved GC performance and reduced memory pressure in large applications.',
                code: `// Better GC control in 4.7.2
GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect();`
            }
        ]
    },
    'netfx472-netfx48': {
        title: '.NET Framework 4.7.2 to 4.8',
        majorChanges: [
            {
                title: 'JIT Compiler Improvements',
                description: 'Significant performance improvements in the Just-In-Time compiler.',
                code: `// Improved JIT optimizations automatically benefit existing code
public class PerformanceExample
{
    // Method inlining and loop optimizations improved
    public int CalculateSum(int[] numbers)
    {
        int sum = 0;
        for (int i = 0; i < numbers.Length; i++)
        {
            sum += numbers[i]; // Better vectorization in 4.8
        }
        return sum;
    }
}`
            },
            {
                title: 'Enhanced Security',
                description: 'Improved security features and TLS 1.3 support.',
                code: `// TLS 1.3 support in .NET Framework 4.8
ServicePointManager.SecurityProtocol = 
    SecurityProtocolType.Tls13 | SecurityProtocolType.Tls12;`
            },
            {
                title: 'Windows Forms Improvements',
                description: 'Enhanced high DPI support and accessibility features.',
                code: `// High DPI awareness in Windows Forms 4.8
[assembly: System.Windows.Forms.Application.EnableVisualStyles()]
[assembly: System.Windows.Forms.Application.SetCompatibleTextRenderingDefault(false)]
[assembly: System.Windows.Forms.Application.SetHighDpiMode(HighDpiMode.SystemAware)]`
            }
        ]
    },
    'netfx48-net5': {
        title: '.NET Framework 4.8 to .NET 5.0',
        majorChanges: [
            {
                title: 'Cross-Platform Support',
                description: 'Major shift from Windows-only to cross-platform development.',
                code: `// Cross-platform detection in .NET 5
using System.Runtime.InteropServices;

public static string GetPlatformInfo()
{
    if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        return "Running on Windows";
    else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        return "Running on Linux";
    else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
        return "Running on macOS";
    else
        return "Unknown platform";
}`
            },
            {
                title: 'Unified BCL',
                description: 'Single Base Class Library across all .NET implementations.',
                code: `// Same APIs work across all platforms in .NET 5
using System.Text.Json;

public class UnifiedExample
{
    public string SerializeObject<T>(T obj)
    {
        // Works on Windows, Linux, macOS, containers
        return JsonSerializer.Serialize(obj);
    }
}`
            },
            {
                title: 'Performance Improvements',
                description: 'Significant performance gains across the board.',
                code: `// Performance improvements are automatic
// JSON serialization is ~2x faster
// String operations improved
// Memory allocation reduced

Span<int> numbers = stackalloc int[100]; // Stack allocation
ReadOnlySpan<char> text = "Hello".AsSpan(); // Zero-copy string operations`
            }
        ]
    },
    'net5-net6': {
        title: '.NET 5.0 to .NET 6.0',
        majorChanges: [
            {
                title: 'Hot Reload',
                description: 'Edit your code while your application is running and see changes applied immediately.',
                code: `// No code changes needed - IDE feature
// Works with Visual Studio, VS Code, and CLI
dotnet watch run --hot-reload

// Supports changes to:
// - Method bodies
// - Adding new methods
// - Adding new types
// - Lambda expressions`
            },
            {
                title: 'Minimal APIs',
                description: 'Create lightweight APIs with minimal ceremony and reduced boilerplate code.',
                code: `// .NET 6 Minimal API
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/users/{id:int}", (int id) => new { Id = id, Name = $"User {id}" });
app.MapPost("/users", (User user) => Results.Created($"/users/{user.Id}", user));

app.Run();

record User(int Id, string Name, string Email);`
            },
            {
                title: 'Global Using Directives',
                description: 'Reduce repetitive using statements across your project with global imports.',
                code: `// GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.DependencyInjection;

// Now available in all files without explicit using statements`
            },
            {
                title: 'File-scoped Namespaces',
                description: 'Reduce indentation by declaring namespaces at the file level.',
                code: `// .NET 6 - File-scoped namespace
namespace MyApp.Services;

public class UserService
{
    public async Task<User> GetUserAsync(int id)
    {
        // Implementation
        return new User { Id = id };
    }
}

// Instead of:
// namespace MyApp.Services
// {
//     public class UserService { ... }
// }`
            }
        ]
    },
    'net6-net7': {
        title: '.NET 6.0 to .NET 7.0',
        majorChanges: [
            {
                title: 'Generic Math Support',
                description: 'Static abstract members in interfaces enable generic math operations.',
                code: `// Generic math operations
using System.Numerics;

public static T Add<T>(T left, T right) where T : INumber<T>
{
    return left + right;
}

public static T[] AddArrays<T>(T[] left, T[] right) where T : INumber<T>
{
    return left.Zip(right, Add).ToArray();
}

// Usage
int result1 = Add(5, 3);        // 8
double result2 = Add(5.5, 3.2); // 8.7
float result3 = Add(5.5f, 3.2f); // 8.7f`
            },
            {
                title: 'Raw String Literals',
                description: 'Multi-line strings without escape sequences, perfect for JSON, XML, or SQL.',
                code: `// Raw string literals with triple quotes
string json = """
    {
        "name": "John Doe",
        "email": "john@example.com",
        "settings": {
            "theme": "dark",
            "notifications": true
        }
    }
    """;

string sql = """
    SELECT u.Name, u.Email, p.Title
    FROM Users u
    INNER JOIN Posts p ON u.Id = p.UserId
    WHERE u.IsActive = 1
        AND p.CreatedDate > @startDate
    ORDER BY p.CreatedDate DESC
    """;

string regex = """\\d{4}-\\d{2}-\\d{2}"""; // No double escaping!`
            },
            {
                title: 'Required Members',
                description: 'Ensure object initialization with required properties and fields.',
                code: `// Required members
public class Person
{
    public required string Name { get; init; }
    public required string Email { get; init; }
    public int Age { get; set; }
    public string? PhoneNumber { get; set; }
}

// Compiler ensures required properties are set
var person = new Person 
{ 
    Name = "John",  // Required
    Email = "john@example.com",  // Required
    Age = 30  // Optional
    // PhoneNumber is optional
};`
            },
            {
                title: 'List Patterns',
                description: 'Pattern matching on arrays and lists with elegant syntax.',
                code: `// List patterns in switch expressions
public static string DescribeArray(int[] array) => array switch
{
    [] => "Empty array",
    [var x] => $"Single element: {x}",
    [var x, var y] => $"Two elements: {x}, {y}",
    [var first, .., var last] => $"First: {first}, Last: {last}",
    [1, 2, 3] => "Exactly 1, 2, 3",
    [1, .. var rest] => $"Starts with 1, rest: [{string.Join(", ", rest)}]",
    _ => "Other pattern"
};`
            }
        ]
    },
    'net7-net8': {
        title: '.NET 7.0 to .NET 8.0',
        majorChanges: [
            {
                title: 'Primary Constructors',
                description: 'Simplified constructor syntax for classes and structs.',
                code: `// Primary constructors in .NET 8
public class Person(string firstName, string lastName, int age)
{
    public string FullName => $"{firstName} {lastName}";
    public bool IsAdult => age >= 18;
    
    public void Introduce() => 
        Console.WriteLine($"Hi, I'm {firstName} {lastName} and I'm {age} years old.");
}

// Usage
var person = new Person("John", "Doe", 30);
person.Introduce(); // Hi, I'm John Doe and I'm 30 years old.`
            },
            {
                title: 'Native AOT Publishing',
                description: 'Compile applications to native code for faster startup and smaller memory footprint.',
                code: `<!-- In project file -->
<PropertyGroup>
    <PublishAot>true</PublishAot>
</PropertyGroup>

<!-- Publish command -->
dotnet publish -c Release -r win-x64

// Results in:
// - Faster startup (up to 4x)
// - Smaller memory footprint (up to 4x less)
// - Self-contained executable
// - No runtime dependency

// AOT-compatible code
[JsonSerializable(typeof(Person))]
public partial class PersonContext : JsonSerializerContext { }`
            },
            {
                title: 'Frozen Collections',
                description: 'Immutable collections optimized for read-heavy scenarios.',
                code: `// Frozen collections for better performance
using System.Collections.Frozen;

// Create frozen collections for read-heavy scenarios
var frozenDict = new Dictionary<string, int>
{
    ["apple"] = 5,
    ["banana"] = 3,
    ["orange"] = 8
}.ToFrozenDictionary();

var frozenSet = new[] { "red", "green", "blue" }.ToFrozenSet();

// Much faster lookups than regular Dictionary/HashSet
// Optimized internal structure for minimal memory and maximum speed
var appleCount = frozenDict["apple"]; // Very fast lookup`
            },
            {
                title: 'Time Abstraction',
                description: 'New TimeProvider abstraction for better testability of time-dependent code.',
                code: `// Time abstraction for better testing
public class OrderService(TimeProvider timeProvider)
{
    public Order CreateOrder(Product product)
    {
        return new Order
        {
            Id = Guid.NewGuid(),
            Product = product,
            CreatedAt = timeProvider.GetUtcNow(), // Testable!
            ExpiresAt = timeProvider.GetUtcNow().AddDays(30)
        };
    }
}

// In tests
var fakeTime = new FakeTimeProvider(new DateTimeOffset(2024, 1, 1, 0, 0, 0, TimeSpan.Zero));
var service = new OrderService(fakeTime);
var order = service.CreateOrder(product);
// order.CreatedAt will always be 2024-01-01`
            }
        ]
    },
    'net8-net9': {
        title: '.NET 8.0 to .NET 9.0',
        majorChanges: [
            {
                title: 'Params Collections',
                description: 'Use params with any collection type, not just arrays.',
                code: `// .NET 9 - params with any collection
public void ProcessItems(params IEnumerable<string> items)
{
    foreach (var item in items)
        Console.WriteLine(item);
}

public void ProcessNumbers(params ReadOnlySpan<int> numbers)
{
    foreach (var num in numbers)
        Console.WriteLine(num);
}

// Can be called with:
ProcessItems("a", "b", "c");  // params array
ProcessItems(list);           // List<string>
ProcessItems(hashSet);        // HashSet<string>
ProcessNumbers(1, 2, 3, 4);   // Span allocation`
            },
            {
                title: 'Partial Properties',
                description: 'Split property declarations across multiple files like partial methods.',
                code: `// File1.cs - Property declaration
public partial class User
{
    public partial string Name { get; set; }
}

// File2.cs - Property implementation (generated code)
public partial class User
{
    private string _name = "";
    
    public partial string Name 
    { 
        get => _name;
        set => _name = value?.Trim() ?? "";
    }
}`
            },
            {
                title: 'Enhanced LINQ',
                description: 'New LINQ methods for better performance and functionality.',
                code: `// .NET 9 - New LINQ methods
var numbers = Enumerable.Range(1, 1000000);

// CountBy - count elements by a key
var digitCounts = numbers.CountBy(x => x.ToString().Length);
// { 1: 9, 2: 90, 3: 900, 4: 90000, 5: 900000, 6: 9000, 7: 1 }

// AggregateBy - aggregate by key in one pass
var sumsByModulo = numbers.AggregateBy(
    x => x % 10,        // key selector
    0,                  // seed
    (acc, x) => acc + x // aggregator
);

// Index - get indices along with values
var indexedItems = items.Index().Where(x => x.Index % 2 == 0);`
            },
            {
                title: 'Enhanced Collection Expressions',
                description: 'More intuitive syntax for creating and working with collections.',
                code: `// Collection expressions improvements
int[] numbers = [1, 2, 3, 4, 5];
List<string> names = ["Alice", "Bob", "Charlie"];

// Spread operator
int[] moreNumbers = [..numbers, 6, 7, 8];
string[] allNames = [..names, "David", "Eve"];

// Dictionary expressions
Dictionary<string, int> ages = new()
{
    ["Alice"] = 25,
    ["Bob"] = 30,
    ["Charlie"] = 35
};`
            }
        ]
    },
    'net9-net10': {
        title: '.NET 9.0 to .NET 10.0 (Preview)',
        majorChanges: [
            {
                title: 'AI Integration',
                description: 'Built-in support for AI and machine learning workloads.',
                code: `// Built-in AI capabilities (Preview)
using Microsoft.AI;

public class SmartService
{
    public async Task<string> GenerateResponseAsync(string prompt)
    {
        // Built-in AI inference
        var aiModel = AI.CreateLanguageModel("gpt-4");
        return await aiModel.GenerateTextAsync(prompt);
    }
    
    public async Task<Classification> ClassifyImageAsync(byte[] imageData)
    {
        var visionModel = AI.CreateVisionModel("vision-v1");
        return await visionModel.ClassifyAsync(imageData);
    }
}`
            },
            {
                title: 'Enhanced Cloud Native',
                description: 'Improved support for cloud-native development and deployment.',
                code: `// Enhanced cloud-native features
[CloudNative]
public class WeatherService
{
    [AutoScale(min: 1, max: 100)]
    [HealthCheck("/health")]
    public async Task<Weather> GetWeatherAsync(string city)
    {
        // Automatic scaling based on load
        // Built-in health checks
        // Enhanced observability
        return await WeatherAPI.GetAsync(city);
    }
}`
            },
            {
                title: 'Compile-time Reflection',
                description: 'Zero-overhead reflection through compile-time generation.',
                code: `// Compile-time reflection (Source Generators)
[GenerateReflection]
public partial class User
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// Generated at compile time
public partial class User
{
    public static PropertyInfo[] GetProperties() => 
        _generatedProperties; // Pre-computed at compile time
        
    public static T GetPropertyValue<T>(object instance, string propertyName) =>
        // Zero-allocation, compile-time optimized
        _propertyAccessors[propertyName](instance);
}`
            },
            {
                title: 'Enhanced Pattern Matching',
                description: 'More powerful pattern matching capabilities.',
                code: `// Enhanced pattern matching in .NET 10
public string ProcessValue(object value) => value switch
{
    // Enhanced range patterns
    int n when n in 1..10 => "Single digit",
    int n when n in 10..100 => "Double digit",
    
    // Enhanced object patterns
    Person { Age: var age, Name: var name } when age > 18 
        => $"Adult: {name}",
    
    // Enhanced collection patterns
    string[] { Length: > 0 } arr when arr.All(s => s.Length > 5) 
        => "All long strings",
    
    // Pattern combinators
    (int x, int y) when x > 0 and y > 0 => "Both positive",
    
    _ => "Unknown pattern"
};`
            }
        ]
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Update version selectors with new options
    updateVersionSelectors();
    // Set default values and compare
    compareVersions();
});

function updateVersionSelectors() {
    const fromSelect = document.getElementById('fromVersion');
    const toSelect = document.getElementById('toVersion');
    
    if (!fromSelect || !toSelect) return;
    
    // Clear existing options
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Add all versions
    Object.entries(versionData).forEach(([key, data]) => {
        const option1 = new Option(data.name, key);
        const option2 = new Option(data.name, key);
        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);
    });
    
    // Set default selections
    fromSelect.value = 'net5';
    toSelect.value = 'net6';
}

function compareVersions() {
    const fromVersion = document.getElementById('fromVersion')?.value;
    const toVersion = document.getElementById('toVersion')?.value;
    const resultsDiv = document.getElementById('comparisonResults');
    
    if (!fromVersion || !toVersion || !resultsDiv) return;
    
    if (fromVersion === toVersion) {
        resultsDiv.innerHTML = `
            <div class="version-comparison">
                <div class="comparison-header">
                    <h2>Same Version Selected</h2>
                    <p>Please select different versions to compare</p>
                </div>
            </div>
        `;
        return;
    }
    
    const comparisonKey = `${fromVersion}-${toVersion}`;
    const reverseKey = `${toVersion}-${fromVersion}`;
    
    let comparison = versionComparisons[comparisonKey];
    let isReversed = false;
    
    if (!comparison) {
        comparison = versionComparisons[reverseKey];
        isReversed = true;
    }
    
    if (!comparison) {
        comparison = getMultiVersionComparison(fromVersion, toVersion);
    }
    
    const fromVersionData = versionData[fromVersion];
    const toVersionData = versionData[toVersion];
    
    if (!comparison) {
        resultsDiv.innerHTML = `
            <div class="version-comparison">
                <div class="comparison-header">
                    <h2>Comparison Not Available</h2>
                    <p>Direct comparison between ${fromVersionData.name} and ${toVersionData.name} is not yet available.</p>
                    <p>Consider comparing intermediate versions or check back for updates.</p>
                </div>
            </div>
        `;
        return;
    }
    
    const title = isReversed ? 
        `${toVersionData.name} to ${fromVersionData.name}` : 
        comparison.title;
    
    let html = `
        <div class="version-comparison">
            <div class="comparison-header">
                <h2>${title}</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
                    <div>
                        <h4>${fromVersionData.name}</h4>
                        <p><strong>Released:</strong> ${fromVersionData.releaseDate}</p>
                        <p><strong>Support:</strong> ${fromVersionData.support}</p>
                        <p>${fromVersionData.description}</p>
                    </div>
                    <div>
                        <h4>${toVersionData.name}</h4>
                        <p><strong>Released:</strong> ${toVersionData.releaseDate}</p>
                        <p><strong>Support:</strong> ${toVersionData.support}</p>
                        <p>${toVersionData.description}</p>
                    </div>
                </div>
            </div>
            <div class="comparison-content">
                <h3>Major Changes and New Features</h3>
    `;
    
    comparison.majorChanges.forEach((change, index) => {
        html += `
            <div class="feature-section">
                <h3>${change.title}</h3>
                <p>${change.description}</p>
                <div class="code-example">
                    <div class="code-label">Code Example</div>
                    <pre><code class="language-csharp">${escapeHtml(change.code)}</code></pre>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
    
    // Trigger Prism.js syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

function getMultiVersionComparison(fromVersion, toVersion) {
    // For complex version jumps, we could combine multiple comparisons
    // For now, return null to show "not available" message
    return null;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add event listeners to dropdowns
const fromVersionSelect = document.getElementById('fromVersion');
const toVersionSelect = document.getElementById('toVersion');

if (fromVersionSelect) {
    fromVersionSelect.addEventListener('change', compareVersions);
}

if (toVersionSelect) {
    toVersionSelect.addEventListener('change', compareVersions);
}