const mongoose = require("mongoose");
const Schema = mongoose.Schema;

UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

    createddate: {
    type: Date,
    default: Date.now
  },
  Activity: [
    {
     
      description: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true    
      },
      to: {
        type: Date    
      }
    }
  ],
});

module.exports = User = mongoose.model("user", UserSchema);