const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})


const wholeSellerSchema = new mongoose.Schema({
  contactPerson: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  businessRegistrationNumber: {
    type: String,
    required: true,
  },
  industryType: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const retailerCreateSchema = new mongoose.Schema({
  wholeseller_id: { type: Object, required: true, },
  email: { type: String, required: true, },
  password: { type: String, required: true, },
  storeName: { type: String, required: true, },
  contactPerson: { type: String, required: true, },
  businessRegistrationNumber: { type: String, required: true, },
  contactPerson: { type: String, required: true, },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  phone: { type: String, required: true, },
  preferredWholesaler: { type: String, required: true, },
  role: { type: String, required: true, },
  createdAt: { type: Date, default: Date.now, },
})

// {
//   "wholeseller_id":{
//     "$oid": "6559e9bbb803969a20c3fa62"
//   },
//   "email": "retailer@example.com",
//   "password": "securePassword123",
//   "storeName": "ABC Retailers Inc.",
//   "contactPerson": "John Doe",
//   "businessRegistrationNumber": "RB789012",
//   "address": {
//     "street": "789 Retail Street",
//     "city": "Retailville",
//     "state": "tamil Nadu",
//     "zipCode": "627811"
//   },
//   "phone": "567-890-1234",
//   "preferredWholesaler": "ABC Wholesalers Inc."
// }

const WholeSeller = mongoose.model('wholesellers', wholeSellerSchema);
const SuperAdmin = mongoose.model("superadmins", superAdminSchema)
const Retailer = mongoose.model("retailers", retailerCreateSchema)
module.exports = { WholeSeller, SuperAdmin, Retailer };
