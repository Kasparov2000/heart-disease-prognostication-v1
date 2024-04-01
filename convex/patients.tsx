import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";

export const getPatient = query({
    args: {patientId: v.optional(v.id('patients'))},
    handler: async (ctx, args) => {
        if (!args.patientId) {
            return null
        }
        const patient = await ctx.db.query("patients")
            .filter((q) => q.eq(q.field("_id"), args.patientId))
            .first();

        const image = patient?.profilePicId ? await ctx.storage.getUrl(patient.profilePicId) : null

        return {...patient, image}
    },
});

export const searchPatients = query({
    args: {name: v.string()},
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
        profilePicId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const existingPhone = await ctx.db.query('patients')
            .filter(q => q.eq(q.field('phone'), args.email))
            .first();

        if (existingPhone) {
            throw new ConvexError({message: 'Phone already exists.', field: 'phone'});
        }

        const existingEmail = await ctx.db.query('patients')
            .filter(q => q.eq(q.field('email'), args.email))
            .first();

        if (existingEmail) {
            throw new ConvexError({message: 'Email already exists.', field: 'email'});
        }

        // Check for existing patient with the same ID number
        const existingIdNumber = await ctx.db.query('patients')
            .filter(q => q.eq(q.field('idNumber'), args.idNumber))
            .first();

        if (existingIdNumber) {
            throw new ConvexError({message: 'A patient with this ID number already exists.', field: 'idNumber'});
        }

        // If no existing patient with same email or ID number, insert the new patient
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
            profilePicId: args?.profilePicId
            ,
        });
    }
});

