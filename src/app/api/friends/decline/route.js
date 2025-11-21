import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return new Response(JSON.stringify({ error: 'Missing user IDs' }), { status: 400 });
    }

    const result = await pool.query(
      `UPDATE friendships
       SET status = 'declined'
       WHERE sender_id = $1 AND receiver_id = $2
       RETURNING *`,
      [senderId, receiverId]
    );

    return new Response(JSON.stringify({ message: 'Friend request declined', friendship: result.rows[0] }), {
      status: 200
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}
