// =================== UNIT CONVERTER ===================

const unitConversions = {
    length: {
        units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
        toMeter: {
            'mm': 0.001,
            'cm': 0.01,
            'm': 1,
            'km': 1000,
            'in': 0.0254,
            'ft': 0.3048,
            'yd': 0.9144,
            'mi': 1609.344
        }
    },
    weight: {
        units: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
        toGram: {
            'mg': 0.001,
            'g': 1,
            'kg': 1000,
            'oz': 28.3495,
            'lb': 453.592,
            'ton': 1000000
        }
    },
    temperature: {
        units: ['C', 'F', 'K'],
        convert: (value, from, to) => {
            let celsius;
            if (from === 'F') celsius = (value - 32) * 5/9;
            else if (from === 'K') celsius = value - 273.15;
            else celsius = value;
            
            if (to === 'F') return celsius * 9/5 + 32;
            else if (to === 'K') return celsius + 273.15;
            else return celsius;
        }
    },
    data: {
        units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        toByte: {
            'B': 1,
            'KB': 1024,
            'MB': 1024 ** 2,
            'GB': 1024 ** 3,
            'TB': 1024 ** 4,
            'PB': 1024 ** 5
        }
    }
};

function updateUnitOptions() {
    const category = document.getElementById('unitCategory').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    const units = unitConversions[category].units;
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    units.forEach(unit => {
        fromUnit.appendChild(new Option(unit, unit));
        toUnit.appendChild(new Option(unit, unit));
    });
    
    if (units.length > 1) {
        toUnit.selectedIndex = 1;
    }
}

function convertUnits() {
    const category = document.getElementById('unitCategory').value;
    const value = parseFloat(document.getElementById('unitValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const result = document.getElementById('unitResultValue');
    
    if (isNaN(value)) {
        result.textContent = 'Please enter a valid number';
        return;
    }
    
    let convertedValue;
    
    if (category === 'temperature') {
        convertedValue = unitConversions.temperature.convert(value, fromUnit, toUnit);
    } else {
        const conversion = unitConversions[category];
        const baseUnit = category === 'length' ? 'toMeter' : 
                         category === 'weight' ? 'toGram' : 'toByte';
        
        const baseValue = value * conversion[baseUnit][fromUnit];
        convertedValue = baseValue / conversion[baseUnit][toUnit];
    }
    
    result.textContent = `${convertedValue.toLocaleString()} ${toUnit}`;
}

// =================== DATE CALCULATOR ===================

function calculateDateDifference() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const output = document.getElementById('dateResults');
    
    if (!startDate || !endDate) {
        output.innerHTML = '<div class="validation-result error">Please select both start and end dates</div>';
        return;
    }
    
    const timeDiff = Math.abs(endDate - startDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = Math.abs((endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()));
    const yearsDiff = Math.abs(endDate.getFullYear() - startDate.getFullYear());
    
    output.innerHTML = `
        <div class="result-item">
            <label>Days:</label>
            <span class="selectable">${daysDiff}</span>
        </div>
        <div class="result-item">
            <label>Weeks:</label>
            <span class="selectable">${weeksDiff}</span>
        </div>
        <div class="result-item">
            <label>Months:</label>
            <span class="selectable">${monthsDiff}</span>
        </div>
        <div class="result-item">
            <label>Years:</label>
            <span class="selectable">${yearsDiff}</span>
        </div>
        <div class="result-item">
            <label>Hours:</label>
            <span class="selectable">${daysDiff * 24}</span>
        </div>
        <div class="result-item">
            <label>Minutes:</label>
            <span class="selectable">${daysDiff * 24 * 60}</span>
        </div>
    `;
}

function addDaysToDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const daysToAdd = parseInt(document.getElementById('daysToAdd').value) || 0;
    const output = document.getElementById('dateResults');
    
    if (!startDate) {
        output.innerHTML = '<div class="validation-result error">Please select a start date</div>';
        return;
    }
    
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    
    output.innerHTML = `
        <div class="result-item">
            <label>Result Date:</label>
            <span class="selectable">${resultDate.toLocaleDateString()}</span>
        </div>
        <div class="result-item">
            <label>ISO Format:</label>
            <span class="selectable">${resultDate.toISOString().split('T')[0]}</span>
        </div>
        <div class="result-item">
            <label>Full Date:</label>
            <span class="selectable">${resultDate.toDateString()}</span>
        </div>
    `;
}

// =================== RANDOM DATA GENERATOR ===================

function generateRandomData() {
    const dataType = document.getElementById('randomDataType').value;
    const count = parseInt(document.getElementById('randomCount').value) || 10;
    const output = document.getElementById('randomOutput');
    
    const generators = {
        names: () => {
            const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
            return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        },
        emails: () => {
            const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
            const username = Math.random().toString(36).substring(2, 8);
            return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
        },
        phones: () => {
            const areaCode = Math.floor(Math.random() * 900) + 100;
            const exchange = Math.floor(Math.random() * 900) + 100;
            const number = Math.floor(Math.random() * 9000) + 1000;
            return `(${areaCode}) ${exchange}-${number}`;
        },
        addresses: () => {
            const streetNumbers = Math.floor(Math.random() * 9999) + 1;
            const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Cedar Ln', 'Maple Way', 'Park Blvd', 'First Ave', 'Second St', 'Third Rd'];
            const cities = ['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Washington', 'Chester', 'Greenville', 'Salem', 'Fairview', 'Oxford'];
            const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
            const zipCode = Math.floor(Math.random() * 90000) + 10000;
            return `${streetNumbers} ${streetNames[Math.floor(Math.random() * streetNames.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}, ${states[Math.floor(Math.random() * states.length)]} ${zipCode}`;
        },
        companies: () => {
            const prefixes = ['Global', 'Universal', 'International', 'Advanced', 'Digital', 'Smart', 'Modern', 'Future', 'Premier', 'Elite'];
            const suffixes = ['Solutions', 'Technologies', 'Systems', 'Innovations', 'Services', 'Dynamics', 'Enterprises', 'Group', 'Corp', 'Industries'];
            return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        },
        numbers: () => {
            return Math.floor(Math.random() * 1000000);
        }
    };
    
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(generators[dataType]());
    }
    
    output.textContent = data.join('\n');
}

// =================== NUMBER BASE CONVERTER ===================

function convertNumberBase() {
    const input = document.getElementById('numberInput').value.trim();
    const inputBase = parseInt(document.getElementById('inputBase').value);
    const output = document.getElementById('baseResults');
    
    if (!input) {
        output.innerHTML = '<div class="validation-result error">Please enter a number</div>';
        return;
    }
    
    try {
        const decimal = parseInt(input, inputBase);
        
        if (isNaN(decimal)) {
            throw new Error('Invalid number for the specified base');
        }
        
        const conversions = [
            { name: 'Binary', base: 2, value: decimal.toString(2) },
            { name: 'Octal', base: 8, value: decimal.toString(8) },
            { name: 'Decimal', base: 10, value: decimal.toString(10) },
            { name: 'Hexadecimal', base: 16, value: decimal.toString(16).toUpperCase() }
        ];
        
        output.innerHTML = conversions.map(conv => `
            <div class="base-item">
                <div class="base-type">${conv.name}</div>
                <div class="base-value" onclick="Utils.copyToClipboard('${conv.value}').then(() => Utils.showCopyFeedback(this))">${conv.value}</div>
            </div>
        `).join('');
        
        if (decimal >= 0 && decimal < 256) {
            const bits = decimal.toString(2).padStart(8, '0');
            output.innerHTML += `
                <div class="base-item">
                    <div class="base-type">8-bit Binary</div>
                    <div class="base-value" onclick="Utils.copyToClipboard('${bits}').then(() => Utils.showCopyFeedback(this))">${bits}</div>
                </div>
            `;
        }
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">✗ ${error.message}</div>`;
    }
}