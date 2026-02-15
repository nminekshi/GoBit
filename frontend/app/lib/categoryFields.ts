export type FieldDefinition = {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "date";
    placeholder?: string;
    options?: string[]; // For select type
    suffix?: string; // e.g. "kg", "cm"
};

export const categoryFields: Record<string, FieldDefinition[]> = {
    vehicles: [
        { key: "make", label: "Make", type: "text", placeholder: "BMW" },
        { key: "model", label: "Model", type: "text", placeholder: "X5" },
        { key: "year", label: "Year", type: "number", placeholder: "2018" },
        { key: "mileage", label: "Mileage", type: "number", suffix: "miles", placeholder: "62000" },
        { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "Electric", "Hybrid"] },
        { key: "transmission", label: "Transmission", type: "select", options: ["Automatic", "Manual"] },
        { key: "vin", label: "VIN", type: "text", placeholder: "Vehicle Identification Number" },
    ],
    watches: [
        { key: "brand", label: "Brand", type: "text", placeholder: "Rolex" },
        { key: "model", label: "Model", type: "text", placeholder: "Submariner" },
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
        { key: "brand", label: "Brand", type: "text" },
        { key: "model", label: "Model", type: "text" },
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
        { key: "brand", label: "Brand", type: "text" },
        { key: "processor", label: "Processor", type: "text" },
        { key: "ram", label: "RAM", type: "text", placeholder: "16GB" },
        { key: "storage", label: "Storage", type: "text", placeholder: "512GB SSD" },
        { key: "graphicsCard", label: "Graphics Card", type: "text" },
    ],
};
