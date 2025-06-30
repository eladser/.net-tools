// .NET Version Comparison Data
const versionData = {
    net5: {
        name: '.NET 5.0',
        releaseDate: 'November 2020',
        support: 'End of Support: May 2022',
        description: 'Unified platform combining .NET Framework, .NET Core, and Xamarin'
    },
    net6: {
        name: '.NET 6.0',
        releaseDate: 'November 2021',
        support: 'LTS - Support until November 2024',
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
    }
};

const versionComparisons = {
    'net5-net6': {
        title: '.NET 5.0 to .NET 6.0',
        majorChanges: [
            {
                title: 'Hot Reload',
                description: 'Edit your code while your application is running and see changes applied immediately without restarting.',
                code: `// No code changes needed - IDE feature
// Works with Visual Studio, VS Code, and CLI
dotnet watch run --hot-reload`
            },
            {
                title: 'Minimal APIs',
                description: 'Create lightweight APIs with minimal ceremony and reduced boilerplate code.',
                code: `// .NET 6 Minimal API
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/users/{id}", (int id) => new { Id = id, Name = "User" + id });

app.Run();`
            },
            {
                title: 'Global Using Directives',
                description: 'Reduce repetitive using statements across your project with global imports.',
                code: `// GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using Microsoft.EntityFrameworkCore;

// Now available in all files without explicit using statements`
            },
            {
                title: 'File-scoped Namespaces',
                description: 'Reduce indentation by declaring namespaces at the file level.',
                code: `// .NET 6 - File-scoped namespace
namespace MyApp.Services;

public class UserService
{
    public User GetUser(int id) => new User { Id = id };
}

// Instead of:
// namespace MyApp.Services
// {
//     public class UserService { ... }
// }`
            },
            {
                title: 'Performance Improvements',
                description: 'Significant performance improvements in JSON serialization, reflection, and overall runtime.',
                code: `// JSON performance improvement example
using System.Text.Json;

// .NET 6 is ~30% faster for JSON operations
var person = new Person { Name = "John", Age = 30 };
var json = JsonSerializer.Serialize(person);
var deserializedPerson = JsonSerializer.Deserialize<Person>(json);`
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
public static T Add<T>(T left, T right) where T : INumber<T>
{
    return left + right;
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
    """;
`
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
}

// Compiler ensures required properties are set
var person = new Person 
{ 
    Name = "John",  // Required
    Email = "john@example.com"  // Required
    // Age is optional
};`
            },
            {
                title: 'Performance Improvements',
                description: 'Enhanced performance in regex, collections, and system types.',
                code: `// Improved regex performance with source generators
[GeneratedRegex(@"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b")]
public static partial Regex EmailRegex();

// Usage - much faster than Regex.IsMatch
bool isValid = EmailRegex().IsMatch("user@example.com");`
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
public class Person(string name, int age)
{
    public string Name { get; } = name;
    public int Age { get; set; } = age;
    
    public void Introduce() => Console.WriteLine($"Hi, I'm {name} and I'm {age} years old.");
}

// Usage
var person = new Person("John", 30);`
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
// - Smaller memory footprint
// - Self-contained executable`
            },
            {
                title: 'Blazor Streaming Rendering',
                description: 'Stream UI updates to improve perceived performance in Blazor Server apps.',
                code: `@* Blazor streaming rendering *@
<div>
    <h1>User Profile</h1>
    @* This renders immediately *@
    <p>Loading user data...</p>
    
    @* This streams in when data is available *@
    <Streaming>
        @await LoadUserDataAsync()
    </Streaming>
</div>

@code {
    private async Task<RenderFragment> LoadUserDataAsync()
    {
        var user = await UserService.GetUserAsync(UserId);
        return @<div><p>Welcome, @user.Name!</p></div>;
    }
}`
            },
            {
                title: 'Source Generators Improvements',
                description: 'Enhanced source generators for better compile-time code generation.',
                code: `// JSON source generator improvements
[JsonSerializable(typeof(Person))]
[JsonSerializable(typeof(List<Person>))]
public partial class PersonContext : JsonSerializerContext { }

// Usage with better performance
var options = new JsonSerializerOptions
{
    TypeInfoResolver = PersonContext.Default
};

string json = JsonSerializer.Serialize(person, options);`
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

// Can be called with:
ProcessItems("a", "b", "c");  // params array
ProcessItems(list);           // List<string>
ProcessItems(hashSet);        // HashSet<string>`
            },
            {
                title: 'Escape Sequences in Raw Strings',
                description: 'Enhanced raw string literals with escape sequence support.',
                code: `// .NET 9 - Escape sequences in raw strings
string path = """C:\\Users\\John\\Documents\\file.txt""";
string json = """
    {
        "message": "Hello\nWorld",
        "path": "C:\\\\temp"
    }
    """;

// No more double escaping needed`
            },
            {
                title: 'LINQ Performance Improvements',
                description: 'Significant performance improvements in LINQ operations.',
                code: `// .NET 9 - Improved LINQ performance
var numbers = Enumerable.Range(1, 1000000);

// Up to 30% faster in .NET 9
var evenNumbers = numbers
    .Where(x => x % 2 == 0)
    .Select(x => x * 2)
    .ToList();

// New LINQ methods
var result = numbers.CountBy(x => x % 10);  // Count by key
var aggregated = numbers.AggregateBy(x => x % 10, 0, (acc, x) => acc + x);`
            },
            {
                title: 'System.Text.Json Improvements',
                description: 'Enhanced JSON serialization with better performance and features.',
                code: `// .NET 9 - Enhanced JSON features
public class Config
{
    [JsonPropertyName("api_key")]
    public required string ApiKey { get; init; }
    
    // Better handling of nullable reference types
    public string? OptionalValue { get; set; }
}

// Improved serialization performance (up to 20% faster)
var config = JsonSerializer.Deserialize<Config>(jsonString);`
            }
        ]
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default values and compare
    compareVersions();
});

function compareVersions() {
    const fromVersion = document.getElementById('fromVersion').value;
    const toVersion = document.getElementById('toVersion').value;
    const resultsDiv = document.getElementById('comparisonResults');
    
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
        // Handle multi-version jumps
        comparison = getMultiVersionComparison(fromVersion, toVersion);
    }
    
    const fromVersionData = versionData[fromVersion];
    const toVersionData = versionData[toVersion];
    
    if (!comparison) {
        resultsDiv.innerHTML = `
            <div class="version-comparison">
                <div class="comparison-header">
                    <h2>Comparison Not Available</h2>
                    <p>Comparison between ${fromVersionData.name} and ${toVersionData.name} is not yet available.</p>
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
    // For now, return null for multi-version jumps
    // This could be enhanced to combine multiple comparisons
    return null;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add event listeners to dropdowns
document.getElementById('fromVersion').addEventListener('change', compareVersions);
document.getElementById('toVersion').addEventListener('change', compareVersions);