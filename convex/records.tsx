import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {undefined} from "zod";

export const createRecord = mutation({
    args: {
        patientId: v.optional(v.id("patients")),
        doctorId: v.optional(v.id("doctors")),
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
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        // Inserting record data into the 'records' table
        // Returning the newly created record
        const risk = Math.floor((Math.random() * 100))
        if (!args.patientId) return {risk, recordId: null}

        const prevRecord = await ctx.db.query("records")
            .filter(q => q.eq(q.field("patientId"), args.patientId))
            .order("desc")
            .first();

        const hasPrevRisk = prevRecord && prevRecord.risk;

        let conditionStatus;
        if (hasPrevRisk) {
            // Compare the current risk with the previous risk
            if (risk === prevRecord.risk) {
                conditionStatus = 'still';
            } else if (risk > prevRecord.risk) {
                conditionStatus = 'deteriorated';
            } else {
                conditionStatus = 'improved';
            }
        } else {
            conditionStatus = 'still'; // No previous risk to compare, so status is 'still'
        }

        const recordId = await ctx.db.insert('records', {
            risk: risk,
            patientId: args.patientId,
            doctorId: args.doctorId,
            age: args.age,
            sex: args.sex,
            cp: args.cp,
            trtbps: args.trtbps,
            chol: args.chol,
            fbs: args.fbs,
            restecg: args.restecg,
            exang: args.exang,
            oldpeak: args.oldpeak,
            slope: args.slope,
            ca: args.ca,
            orgId: args.orgId,
            thal: args.thal,
            notes: args.notes,
            conditionStatus: conditionStatus
        });


        return {risk, recordId}
    }
});

export const getPatientRecords = query({
    args: { patientId: v.optional(v.id('patients')) },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("records")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .order("desc")
            .take(100);
    },
});

export const getPatientRecord = query({
    args: { recordId: v.optional(v.id('records')) },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("records")
            .filter((q) => q.eq(q.field("_id"), args.recordId))
            .order("desc")
            .first();
    },
});