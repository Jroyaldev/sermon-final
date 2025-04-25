import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields (email, password, name)' }, { status: 400 });
    }

    // Basic validation (consider adding more robust validation, e.g., password strength)
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const client: MongoClient = await clientPromise;
    const db = client.db('sermon_flow_app'); 
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Insert new user
    const result = await usersCollection.insertOne({
      name,
      email,
      hashedPassword, // Store the hashed password
      emailVerified: null, // Field often used by NextAuth adapter, good to have
      image: null, // Optional image field
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'User registered successfully', userId: result.insertedId }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
} 