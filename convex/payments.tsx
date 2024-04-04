import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";

// Initialize a global cache object for payment attempts

export const addPayment = mutation({
    args: {
        paymentMethod: v.string(),
        planType: v.union(v.literal("standard"), v.literal("basic"), v.literal("premium")),
        orgId: v.string(),
        cardDetails: v.object({
            cardHolderName: v.string(),
            cardNumber: v.string(),
            expirationMonth: v.number(),
            expirationYear: v.number(),
            cvc: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        console.log('Processing payment:', args);

        // Check the current subscription status and plan type
        const latestPayment = await ctx.db.query("payments")
            .filter(q => q.eq(q.field("orgId"), args.orgId))
            .order("desc")
            .first();

        let isSubscriptionActive = false;

        if (latestPayment) {
            const currentDate = new Date();
            const subscriptionEndDate = new Date(latestPayment._creationTime);
            subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30); // Assuming 30-day billing cycles
            isSubscriptionActive = currentDate < subscriptionEndDate;

            // Prevent payment if the same plan is active
            if (isSubscriptionActive && latestPayment.planType === args.planType) {
                throw new Error("A subscription with this plan is already active.");
            }
        }

        // Get the count of previous payment attempts for this orgId
        const paymentAttemptsCount = (await ctx.db.query('paymentAttempts')
            .filter(q => q.eq(q.field('orgId'), args.orgId))
            .collect()).length;

        // First attempt always fails, subsequent attempts have a 95% success rate
        let isSuccess = paymentAttemptsCount > 0 ? Math.random() < 0.95 : false;

        // Record the payment attempt
        await ctx.db.insert("paymentAttempts", {
            orgId: args.orgId,
            wasSuccessful: isSuccess
        });

        // if (!isSuccess) {
        //     throw new ConvexError({message: "Insufficient Funds."});
        // }

        // Process successful payment
        const paymentRecord = {
            paymentMethod: args.paymentMethod,
            planType: args.planType,
            amount: 100, // Assuming a fixed amount for simplicity
            status: 'success',
            orgId: args.orgId
        };

        await ctx.db.insert("payments", paymentRecord);

        return {status: 'Success', details: paymentRecord};
    },
});

export const checkSubscriptionStatus = query({
    args: {orgId: v.optional(v.string())},
    handler: async (ctx, args) => {
        if (!args.orgId) {
            return {status: 'NotFoundOrg', message: 'Organization not found.'};
        }
        const subscription = await ctx.db.query("payments")
            .filter(q => q.eq(q.field("orgId"), args.orgId))
            .order("desc")
            .first();

        if (!subscription) {
            return {status: 'NotFoundOrg', message: 'Subscription record not found.'};
        }

        const currentDate = new Date();
        const subscriptionEndDate = new Date(subscription._creationTime);
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
        const isSubscriptionValid = currentDate < subscriptionEndDate;

        return {
            status: isSubscriptionValid ? 'Active' : 'Expired',
            planType: subscription.planType
        };
    },
});
