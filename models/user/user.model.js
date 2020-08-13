const mongoose = require('mongoose');
const options = { discriminatorKey: 'userType', versionKey: false };
const UserSchema = new mongoose.Schema({
  full_name: { type: String, lowercase: true },
  email: {
    type: String, lowercase: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  google: {
    id: { type: String, index: true },
    email: {
      type: String, lowercase: true, index: true,
      // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
      match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    }
  },
  facebook: {
    id: { type: String, index: true },
    email: {
      type: String, lowercase: true, index: true,
      // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
      match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    }
  },
  password: String,
  verified: { type: Boolean },
  active: { type: Boolean, default: true },
  profile_picture: { type: String }
}, options);

const User = mongoose.model('user', UserSchema);
const Doctor = User.discriminator("doctor", new mongoose.Schema({
  dob: Date,
  gender: String,
  professionalStatement: String,
  education: String,
  college: String,
  location: [{ type: Number, index: { type: '2dsphere' } }],//[longitude,latitude]
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "language" }],
  symptoms: [{ type: mongoose.Schema.Types.ObjectId, ref: "symptom" }],
  stateLicense: { type: String },
  licenseExpiration: { type: String },
  boardExpiration: { type: String },
  yearsOfExperience: { type: String },
  malpracticeLawsuites: { type: Boolean },
  medicalBoardDeciplinaryAction: { type: Boolean },
  checkbox1: {
    title: { type: String, default: "Provides Telehealth urgent clinical care  with Audiovisual consult." },
    accepted: Boolean,
  },
  checkbox2: {
    title: { type: String, default: "Correspondence based on clinical judgments and Umed templates questionnaires protocols in accordance with regulatory requirements following UMed standards." },
    accepted: Boolean,
  },
  checkbox3: {
    title: { type: String, default: "Consult with MD supervisor as necessary." },
    accepted: Boolean,
  },
  checkbox4: {
    title: { type: String, default: "Provide calling patients with specific clinical evaluation with proper template  including  review of  past medical history , current medications, Allergies, Review of systems ,diagnosis, prescribe medications and other areas related to patient's current condition and outcomes." },
    accepted: Boolean,
  },
  checkbox5: {
    title: { type: String, default: "Follow regulatory requirements and follow HIPPA regularities and standards of practice." },
    accepted: Boolean,
  },
}, options))
const Patient = User.discriminator("patient", new mongoose.Schema({
  dob: Date,
  mobile_number: String,
  gender: String,
  address: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: String,
  }
}, options))
module.exports = {
  User, Doctor, Patient
}