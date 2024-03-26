import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define custom types
export const roles = v.union(v.literal("admin"), v.literal("member"));

// Define the schema
export default defineSchema({
    // Users table
        users: defineTable({
            tokenIdentifier: v.string(),
            name: v.optional(v.string()),
            image: v.optional(v.string()),
            orgIds: v.array(
                v.object({
                    orgId: v.string(),
                    role: roles,
                })
            ),
        }).index("by_tokenIdentifier", ["tokenIdentifier"]), // Index by email for efficient queries

    // Hospitals table
    hospitals: defineTable({
        name: v.string(), // Hospital name
        email: v.string(), // Hospital name
        country: v.string(), // Country where hospital is located
        city: v.string(), // City where hospital is located
        state: v.string(), // State/Province where hospital is located
        postalCode: v.string(), // ZIP/Postal code of hospital
        phone: v.string(), // Hospital phone number
        website: v.optional(v.string()), // Hospital website URL (optional)
        type: v.string(), // Type of hospital
        registrationNumber: v.string(), // Hospital registration number
        taxId: v.optional(v.string()), // Tax ID of hospital (optional)
        accreditationDetails: v.optional(v.string()), // Accreditation details (optional)
        authorizedContact: v.string(), // Authorized contact person at hospital
        authorizedEmail: v.string(), // Authorized contact email
        authorizedPhone: v.string(), // Authorized contact phone number
        positionTitle: v.string(), // Position/title of authorized contact
    })  .index("by_phone", ["phone"])
        .index("by_email", ["email"])
        .index("by_registrationNumber", ["registrationNumber"])
        .index("by_taxId", ["taxId"]),
    applications: defineTable({
        name: v.string(), // Hospital name
        email: v.string(), // Hospital name
        country: v.string(), // Country where hospital is located
        city: v.string(), // City where hospital is located
        state: v.string(), // State/Province where hospital is located
        postalCode: v.string(), // ZIP/Postal code of hospital
        phone: v.string(), // Hospital phone number
        website: v.optional(v.string()), // Hospital website URL (optional)
        type: v.string(), // Type of hospital
        registrationNumber: v.string(), // Hospital registration number
        taxId: v.optional(v.string()), // Tax ID of hospital (optional)
        accreditationDetails: v.optional(v.string()), // Accreditation details (optional)
        authorizedContact: v.string(), // Authorized contact person at hospital
        authorizedEmail: v.string(), // Authorized contact email
        authorizedPhone: v.string(), // Authorized contact phone number
        positionTitle: v.string(), // Position/title of authorized contact
        status: v.string(),
    })  .index("by_phone", ["phone"])
        .index("by_email", ["email"])
        .index("by_registrationNumber", ["registrationNumber"])
        .index("by_taxId", ["taxId"]),

    // Doctors table
    doctors: defineTable({
        name: v.string(), // Doctor name
        email: v.string(), // Doctor name
        phone: v.string(), // Doctor name
        specialization: v.string(), // Doctor's specialization
        hospitalId: v.id("hospitals"), // Hospital ID (foreign key)// User ID (foreign key)
    })  .index("by_hospitalId", ["hospitalId"])
        .index("by_phone", ["phone"])
        .index("by_email", ["email"]), // Index by hospitalId for efficient queries

    // Patients table
        patients: defineTable({
            city: v.string(),
            country: v.string(),
            dob: v.string(),
            email: v.string(),
            idNumber: v.string(),
            name: v.string(),
            phone: v.string(),
            profilePicId: v.id("_storage"),
            state: v.string(),
            zipCode: v.string(),
        }).index("by_email", ["email"])
            .index("by_idNumber", ["idNumber"])
            .index("by_phone", ["phone"])
            .searchIndex("search_name", {
                searchField: "name",
            }),
    // Medical Records table
    records: defineTable({
        patientId: v.id("patients"),
        doctorId: v.id("doctors"),
        hospitalId: v.id("hospitals"),
        notes: v.string(),
        age: v.number(),
        sex: v.number(),
        cp: v.number(),
        trtbps: v.number(),
        chol: v.number(),
        fbs: v.number(),
        restecg: v.number(),
        thalach: v.number(),
        exang: v.number(),
        oldpeak: v.number(),
        slope: v.number(),
        ca: v.number(),
        thal: v.number(),
        risk: v.string(),

    }),

    // Payments table
    payments: defineTable({
        amount: v.number(), // Payment amount
        status: v.string(), // Payment status
        email: v.string(), // Email of payer
        hospitalId: v.id("hospitals"), // User ID of payer (foreign key)
        planType: v.string(),
        paymentMethod: v.string()

    })
});
