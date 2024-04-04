import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

// Define custom types
export const roles = v.union(v.literal("admin"), v.literal("member"));

// Define the schema
export default defineSchema({
    // Users table
    users: defineTable({
        orgId: v.string(),
        userId: v.string()
    }),

    // Hospitals table
    hospitals: defineTable({
        name: v.string(),
        country: v.string(),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        phone: v.string(), // Hospital phone
        email: v.string(), // Hospital email
        website: v.optional(v.string()),
        type: v.string(),
        registrationNumber: v.string(),
        taxId: v.optional(v.string()),
        doctorName: v.string(),
        doctorEmail: v.string(),
        doctorPhone: v.string(),
        specialization: v.string(),
        licenseNumber: v.string(),
        applicationId: v.id('applications'),
        orgId: v.string()
    }).index("by_phone", ["phone"])
        .index("by_email", ["email"])
        .index("by_registrationNumber", ["registrationNumber"])
        .index("by_taxId", ["taxId"])
        .index("by_applicationId", ["applicationId"]),
    applications: defineTable({
        name: v.string(),
        country: v.string(),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        phone: v.string(), // Hospital phone
        email: v.string(), // Hospital email
        website: v.optional(v.string()),
        type: v.string(),
        registrationNumber: v.string(),
        taxId: v.optional(v.string()),
        doctorName: v.string(),
        doctorEmail: v.string(),
        doctorPhone: v.string(),
        specialization: v.string(),
        licenseNumber: v.string(),
        status: v.string(),
    }).index("by_phone", ["phone"])
        .index("by_email", ["email"])
        .index("by_registrationNumber", ["registrationNumber"])
        .index("by_taxId", ["taxId"]),

    // Doctors table
    doctors: defineTable({
        name: v.string(), // Doctor name
        email: v.string(), // Doctor name
        phone: v.string(), // Doctor name
        specialization: v.string(), // Doctor's specialization
        orgId: v.string(), // Hospital ID (foreign key)// User ID (foreign key)
        userId: v.string(),
    }).index("by_orgId", ["orgId"])
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
        sex: v.number(),
        phone: v.string(),
        profilePicId: v.optional(v.id("_storage")),
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
        doctorId: v.optional(v.id("doctors")),
        hospitalId: v.optional(v.id("hospitals")),
        orgId: v.optional(v.string()),
        notes: v.optional(v.string()),
        age: v.number(),
        sex: v.number(),
        cp: v.number(),
        trtbps: v.number(),
        chol: v.number(),
        fbs: v.number(),
        restecg: v.number(),
        exang: v.number(),
        oldpeak: v.number(),
        slope: v.number(),
        ca: v.number(),
        thal: v.number(),
        risk: v.number(),
        conditionStatus: v.optional(v.string())

    }),

    // Payments table
    payments: defineTable({
        amount: v.number(), // Payment amount
        status: v.string(), // Payment status
        planType: v.union(
            v.literal("standard"),
            v.literal("basic"),
            v.literal("premium")),
        paymentMethod: v.string(),
        orgId: v.string()
    }),

    paymentAttempts: defineTable({
        orgId: v.string(),
        wasSuccessful: v.boolean()
    })
});
