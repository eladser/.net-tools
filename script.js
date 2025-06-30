function extractProperties(description) {
    const properties = [];
    
    // Simple property extraction
    if (description.includes('id')) properties.push({ name: 'Id', type: 'int' });
    if (description.includes('name')) properties.push({ name: 'Name', type: 'string' });
    if (description.includes('email')) properties.push({ name: 'Email', type: 'string' });
    if (description.includes('date') || description.includes('created')) 
        properties.push({ name: 'CreatedAt', type: 'DateTime' });
    if (description.includes('roles') || description.includes('list')) 
        properties.push({ name: 'Roles', type: 'List<string>' });
    
    return properties.length > 0 ? properties : [
        { name: 'Id', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'CreatedAt', type: 'DateTime' }
    ];
}