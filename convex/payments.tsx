import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addPayment = mutation({
    args: {
        hospitalId: v.id('hospitals'),
        paymentMethod: v.string(),
        planType: v.string(),
        amount: v.number(),
        email: v.string(),
        cardDetails: v.object({
            cardNumber: v.string(),
            cardHolderName: v.string(),
            expirationMonth: v.string(),
            expirationYear: v.string(),
            cvc: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        console.log('Processing payment:', args);

        const paymentRecord = {
            hospitalId: args.hospitalId,
            paymentMethod: args.paymentMethod,
            planType: args.planType,
            amount: args.amount,
            status: 'success',
            email: args.email
        };

        await ctx.db.insert("payments", paymentRecord);

        return { status: 'Success', details: paymentRecord };
    },
});

export const checkSubscriptionStatus = query({
    args: { hospitalId: v.id('hospitals') },
    handler: async (ctx, args) => {
        const subscription = await ctx.db.query("payments")
            .filter(q => q.eq(q.field("hospitalId"), args.hospitalId))
            .order("desc")
            .first();

        if (!subscription) {
            return { status: 'NotFound', message: 'Subscription record not found.' };
        }

        const currentDate = new Date();
        const subscriptionEndDate = new Date(subscription._creationTime);
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
        const isSubscriptionValid = currentDate < subscriptionEndDate;

        return {
            status: isSubscriptionValid ? 'Active' : 'Expired',
            subscriptionDetails: subscription
        };
    },
});
