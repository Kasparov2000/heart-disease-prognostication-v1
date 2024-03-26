import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const getPatients = query({
    args: {},
    handler: async (ctx) => {
        const patients = await ctx.db.query("patients").collect();
        return Promise.all(
            patients.map(async (patient) => ({
                ...patient,
                // If the message is an "image" its `body` is an `Id<"_storage">`
                image: patient.profilePicId ? await ctx.storage.getUrl(patient.profilePicId) : null
            })),
        );
    },
});

export const searchPatients = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const patients = await ctx.db
            .query('patients')
            .withSearchIndex('search_name', q => q.search('name', args.name))
            .collect();
        return Promise.all(
            patients.map(async (patient) => ({
                ...patient,
                image: patient.profilePicId ? await ctx.storage.getUrl(patient.profilePicId) : null
            })),
        );
    },
});


export const CreatePatient = mutation({
    args: {
        name: v.string(),
        dob: v.string(),
        email: v.string(),
        phone: v.string(),
        idNumber: v.string(),
        country: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        profilePicId: v.id("_storage")
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('patients', {
            name: args.name,
            dob: args.dob,
            email: args.email,
            phone: args.phone,
            idNumber: args.idNumber,
            country: args.country,
            city: args.city,
            state: args.state,
            zipCode: args.zipCode,
            profilePicId: args.profilePicId
        });
    }
});

