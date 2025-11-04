import { NextRequest, NextResponse } from 'next/server'

interface Resend {
  emails: {
    send(payload: {
      from: string;
      to: string[];
      replyTo: string;
      subject: string;
      html: string;
    }): Promise<any>;
  };
}

// Optional: Resend email service if RESEND_API_KEY is provided
let resend: Resend | null = null
try {
  // Dynamically import to avoid hard dependency if not installed
  // @ts-expect-error
  const { Resend } = await import('resend')
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
} catch {
  // Resend not installed, fallback to console logging
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body || {}

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    // If Resend is configured, send email
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Pasalku.ai <noreply@pasalku.ai>',
          to: ['support@pasalku.ai'],
          replyTo: email,
          subject: `[Contact] ${subject}`,
          html: `
            <h2>Pesan Baru dari Form Kontak</h2>
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subjek:</strong> ${subject}</p>
            <p><strong>Pesan:</strong></p>
            <p>${String(message).replace(/\n/g, '<br/>')}</p>
          `,
        })
      } catch (e) {
        console.error('Gagal mengirim email melalui Resend:', e)
      }
    } else {
      // Fallback: log ke server
      console.log('[CONTACT_FORM]', { name, email, subject, message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 })
  }
}
