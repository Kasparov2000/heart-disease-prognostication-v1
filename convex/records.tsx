import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {undefined} from "zod";

export const createRecord = mutation({
    args: {
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
        doctorId: v.id('doctors'),
        patientId: v.id('patients'),
        hospitalId: v.id('hospitals'),
        risk: v.string(),
        notes: v.string(),
    },
    handler: async (ctx, args) => {
        // Inserting record data into the 'records' table
        // Returning the newly created record
        return await ctx.db.insert('records', {
            risk: args.risk,
            doctorId: args.doctorId,
            patientId: args.patientId,
            hospitalId: args.hospitalId,
            age: args.age,
            sex: args.sex,
            cp: args.cp,
            trtbps: args.trtbps,
            chol: args.chol,
            fbs: args.fbs,
            restecg: args.restecg,
            thalach: args.thalach,
            exang: args.exang,
            oldpeak: args.oldpeak,
            slope: args.slope,
            ca: args.ca,
            thal: args.thal,
            notes: args.notes
        });
    }
});

export const getPatientRecords = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("records")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .order("desc")
            .take(100);
    },
});