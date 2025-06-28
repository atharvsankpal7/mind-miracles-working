import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.key_id as string,
  key_secret: process.env.key_secret,
});


export async function POST(req: Request) {
  const { amount } = await req.json();
  // const amount = 100;
  console.log(razorpay);
  console.log("hi");
  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
  });
  console.log("order:" );
  console.log(order);
  return NextResponse.json(order);
}
