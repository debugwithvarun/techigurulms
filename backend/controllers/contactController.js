const Contact = require('../models/Contact');
const { sendContactTicketEmail, sendContactAdminNotifyEmail } = require('../utlis/emailService');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const newContact = await Contact.create({ name, email, subject, message });

        // Fire emails concurrently (non-blocking — don't fail submission if email fails)
        const ticketId = newContact._id.toString().slice(-8).toUpperCase();
        Promise.all([
            sendContactTicketEmail(email, name, subject, ticketId),
            sendContactAdminNotifyEmail(name, email, subject, message),
        ]).catch(err => console.error('Contact email error:', err));

        res.status(201).json({
            success: true,
            data: newContact,
            message: 'Your message has been sent successfully! We will get back to you soon.',
        });
    } catch (error) {
        console.error('Contact submit error:', error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Mark a contact message as read
// @route   PATCH /api/contact/:id/read
// @access  Private/Admin
exports.markContactRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
        res.json({ success: true, data: contact });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
