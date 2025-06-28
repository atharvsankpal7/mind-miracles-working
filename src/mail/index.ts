import nodemailer from 'nodemailer';

const Transporter = nodemailer.createTransport({
  host: process.env.ENDPOINT || 'email-smtp.eu-north-1.amazonaws.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME || 'AKIAW3MEBDWDAQYVRSW2',
    pass:
      process.env.SMTP_PASSWORD ||
      'BKQf6ArmUEcHwznX3UEW8HXPJqU8vPFSCTbLtvzcYso/',
  },
});

export async function getMailonRegister(data: any) {
  const { firstName, lastName, mobileNo, email, age, place } = data;
  await Transporter.sendMail({
    from: 'dipakhade214@gmail.com',
    sender: 'dipakhade214@gmail.com',
    to: 'mindmiracles1707@gmail.com',
    subject: 'new registration',
    html: `<div>
      <h1>New Registration</h1>
      <p><b>Name:</b> <span>${firstName} ${lastName}</span></p>
      <p><b>Mobile No:</b> <span>${mobileNo}</span></p>
      <p><b>Email:</b> <span>${email}</span></p>
      <p><b>Age:</b> <span>${age}</span></p>
      <p><b>Place:</b> <span>${place}</span></p>
    </div>`,
  });
}

export async function sendCounsellingConfirmation(data: any) {
  const { name, email, whatsapp, age, amountPaid } = data;
  
  // Send email to user
  await Transporter.sendMail({
    from: 'mindmiracles1707@gmail.com',
    to: email,
    subject: 'Personal Counselling Session Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2F5A32;">Counselling Session Confirmation</h1>
        <p>Dear ${name},</p>
        <p>Thank you for booking a personal counselling session with Mind Miracles. Your payment has been successfully processed.</p>
        <p>Session Details:</p>
        <ul>
          <li>Amount Paid: ₹${amountPaid}</li>
        </ul>
        <p>We will contact you shortly on your WhatsApp number (${whatsapp}) to schedule your session.</p>
        <p>Best regards,<br>Mind Miracles Team</p>
      </div>
    `
  });

  // Send notification to admin
  await Transporter.sendMail({
    from: 'mindmiracles1707@gmail.com',
    to: 'mindmiracles1707@gmail.com',
    subject: 'New Counselling Session Booking',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>New Counselling Session Booking</h1>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>WhatsApp:</b> ${whatsapp}</p>
        <p><b>Age:</b> ${age}</p>
        <p><b>Amount Paid:</b> ₹${amountPaid}</p>
      </div>
    `
  });
}

export async function getTestResultMail(data: any) {
  const { name, age, occupation, mobile, email, score } = data;
  
  // Determine result category based on score
  const getResultCategory = (score: number) => {
    if (score >= 20) return { category: 'Excellent', color: '#22c55e' };
    if (score >= 15) return { category: 'Good', color: '#3b82f6' };
    if (score >= 10) return { category: 'Fair', color: '#f59e0b' };
    return { category: 'Needs Attention', color: '#ef4444' };
  };

  const result = getResultCategory(score);
  
  // Send email to user with their test results
  await Transporter.sendMail({
    from: 'mindmiracles1707@gmail.com',
    to: email,
    subject: 'Your Mental Health Assessment Results - Mind Miracles',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2F5A32; margin-bottom: 10px;">Mind Miracles</h1>
          <h2 style="color: #666; font-weight: normal;">Mental Health Assessment Results</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>Dear ${name},</p>
          <p>Thank you for taking our mental health assessment. Here are your results:</p>
        </div>
        
        <div style="background-color: white; border: 2px solid ${result.color}; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
          <h3 style="color: ${result.color}; margin-bottom: 10px; font-size: 24px;">${result.category}</h3>
          <p style="font-size: 18px; margin: 0;">Score: ${score}/25</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #2F5A32; margin-bottom: 15px;">What this means:</h4>
          ${score >= 20 ? 
            '<p>Your mental well-being appears to be excellent. Keep maintaining your healthy habits and positive mindset!</p>' :
            score >= 15 ?
            '<p>Your mental health is generally good. Continue with your current self-care practices and consider minor improvements where needed.</p>' :
            score >= 10 ?
            '<p>Your mental health is fair. Consider implementing some stress management techniques and self-care strategies. Our counselling services might be beneficial.</p>' :
            '<p>Your results suggest you might benefit from professional support. We strongly recommend considering our personal counselling services to help improve your mental well-being.</p>'
          }
        </div>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #2F5A32; margin-bottom: 15px;">Our Services Can Help:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Personal Counselling Sessions</li>
            <li style="margin-bottom: 8px;">7-Day Life Transformation Program</li>
            <li style="margin-bottom: 8px;">Stress Management Techniques</li>
            <li style="margin-bottom: 8px;">Mindfulness and Meditation Training</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="margin-bottom: 15px;">Ready to take the next step towards better mental health?</p>
          <a href="https://mindmiracles.com/cources" style="background-color: #2F5A32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Explore Our Programs</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
          <p>Best regards,<br>Mind Miracles Team</p>
          <p>Contact: +91-779-808-2219 | Email: mindmiracles1707@gmail.com</p>
        </div>
      </div>
    `
  });

  // Send notification to admin with test results
  await Transporter.sendMail({
    from: 'mindmiracles1707@gmail.com',
    to: 'mindmiracles1707@gmail.com',
    subject: 'New Mental Health Assessment Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2F5A32;">New Mental Health Assessment</h1>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Participant Details:</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Age:</b> ${age}</p>
          <p><b>Occupation:</b> ${occupation}</p>
          <p><b>Mobile:</b> ${mobile}</p>
          <p><b>Email:</b> ${email}</p>
          
          <h3 style="margin-top: 20px;">Assessment Results:</h3>
          <p><b>Score:</b> ${score}/25</p>
          <p><b>Category:</b> <span style="color: ${result.color}; font-weight: bold;">${result.category}</span></p>
          
          ${score < 15 ? 
            '<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-top: 15px;"><p style="margin: 0; color: #856404;"><b>⚠️ Follow-up Recommended:</b> This participant may benefit from personal counselling.</p></div>' : 
            ''
          }
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #666; font-size: 14px;">Assessment completed on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `
  });
}