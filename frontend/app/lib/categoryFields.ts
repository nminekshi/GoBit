export type FieldDefinition = {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "date";
    placeholder?: string;
    options?: string[]; // For select type
    dependsOn?: string;
    dependentOptions?: Record<string, string[]>;
    suffix?: string; // e.g. "kg", "cm"
};

export const categoryFields: Record<string, FieldDefinition[]> = {
    vehicles: [
        { key: "make", label: "Make", type: "select", options: ["Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Ford", "Chevrolet", "Tesla", "Nissan", "Volkswagen"] },
        { 
            key: "model", label: "Model", type: "select", 
            dependsOn: "make",
            dependentOptions: {
                "Toyota": ["Camry", "Corolla", "RAV4", "Prius", "Highlander"],
                "Honda": ["Civic", "Accord", "CR-V", "Pilot"],
                "BMW": ["3 Series", "5 Series", "X3", "X5", "M3"],
                "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "GLC"],
                "Audi": ["A4", "A6", "Q5", "Q7"],
                "Ford": ["F-150", "Mustang", "Explorer", "Escape"],
                "Chevrolet": ["Silverado", "Equinox", "Tahoe", "Malibu"],
                "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
                "Nissan": ["Altima", "Rogue", "Sentra"],
                "Volkswagen": ["Jetta", "Passat", "Tiguan", "Golf"]
            }
        },
        { key: "year", label: "Year", type: "number", placeholder: "2018" },
        { key: "mileage", label: "Mileage", type: "number", suffix: "miles", placeholder: "62000" },
        { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "Electric", "Hybrid"] },
        { key: "transmission", label: "Transmission", type: "select", options: ["Automatic", "Manual"] },
        { key: "vin", label: "VIN", type: "text", placeholder: "Vehicle Identification Number" },
    ],
    watches: [
        { key: "brand", label: "Brand", type: "select", options: ["Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Tag Heuer", "Breitling", "Seiko", "Casio", "Cartier"] },
        { 
            key: "model", label: "Model", type: "select", 
            dependsOn: "brand",
            dependentOptions: {
                "Rolex": ["Submariner", "Daytona", "Datejust", "GMT-Master II", "Oyster Perpetual"],
                "Omega": ["Speedmaster", "Seamaster", "Aqua Terra", "Constellation"],
                "Patek Philippe": ["Nautilus", "Aquanaut", "Calatrava"],
                "Audemars Piguet": ["Royal Oak", "Royal Oak Offshore", "Code 11.59"],
                "Tag Heuer": ["Carrera", "Monaco", "Aquaracer", "Formula 1"],
                "Breitling": ["Navitimer", "Superocean", "Chronomat"],
                "Seiko": ["Prospex", "Presage", "Astron", "5 Sports"],
                "Casio": ["G-Shock", "Edifice", "Pro Trek"],
                "Cartier": ["Tank", "Santos", "Ballon Bleu", "Panthère"]
            }
        },
        { key: "referenceNumber", label: "Reference Number", type: "text" },
        { key: "caseMaterial", label: "Case Material", type: "text", placeholder: "Stainless Steel" },
        { key: "movement", label: "Movement", type: "select", options: ["Automatic", "Manual", "Quartz"] },
        { key: "year", label: "Year of Production", type: "number" },
        { key: "boxPapers", label: "Box & Papers", type: "select", options: ["Yes", "No", "Partial"] },
    ],
    realestate: [
        { key: "propertyType", label: "Property Type", type: "select", options: ["House", "Apartment", "Land", "Commercial"] },
        { key: "bedrooms", label: "Bedrooms", type: "number" },
        { key: "bathrooms", label: "Bathrooms", type: "number" },
        { key: "squareFootage", label: "Square Footage", type: "number", suffix: "sq ft" },
        { key: "lotSize", label: "Lot Size", type: "number", suffix: "acres" },
        { key: "yearBuilt", label: "Year Built", type: "number" },
    ],
    electronics: [
        { key: "brand", label: "Brand", type: "select", options: ["Apple", "Samsung", "Sony", "LG", "Microsoft", "Bose", "JBL", "Panasonic"] },
        { 
            key: "model", label: "Model", type: "select", 
            dependsOn: "brand",
            dependentOptions: {
                "Apple": ["iPhone 14", "iPhone 15", "MacBook Pro", "MacBook Air", "iPad Pro", "Apple Watch", "AirPods Pro"],
                "Samsung": ["Galaxy S23", "Galaxy S24", "Galaxy Z Fold", "Galaxy Tab S9", "The Frame TV"],
                "Sony": ["PlayStation 5", "WH-1000XM5", "Bravia XR", "Alpha a7 IV"],
                "LG": ["OLED C3", "OLED G3", "UltraGear Monitor"],
                "Microsoft": ["Xbox Series X", "Surface Pro 9", "Surface Laptop 5"],
                "Bose": ["QuietComfort Ultra", "SoundLink Revolve+", "Smart Soundbar 900"],
                "JBL": ["Flip 6", "Charge 5", "PartyBox 310", "Tour One M2"],
                "Panasonic": ["Lumix GH6", "Toughbook", "OLED MZ2000"]
            }
        },
        { key: "condition", label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good", "Used - Fair"] },
        { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] },
    ],
    art: [
        { key: "artist", label: "Artist", type: "text" },
        { key: "medium", label: "Medium", type: "text", placeholder: "Oil on canvas" },
        { key: "dimensions", label: "Dimensions", type: "text", placeholder: "24 x 36 in" },
        { key: "year", label: "Year", type: "number" },
        { key: "provenance", label: "Provenance", type: "text", placeholder: "History of ownership" },
    ],
    computers: [
        { key: "brand", label: "Brand", type: "select", options: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft"] },
        { key: "processor", label: "Processor", type: "select", options: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3"] },
        { key: "ram", label: "RAM", type: "select", options: ["8GB", "16GB", "32GB", "64GB"] },
        { key: "storage", label: "Storage", type: "text", placeholder: "512GB SSD" },
        { key: "graphicsCard", label: "Graphics Card", type: "text" },
    ],
};
