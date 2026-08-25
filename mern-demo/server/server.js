const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MERN Demo API' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend dang hoat dong' });
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Khong tim thay sinh vien' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Khong tim thay sinh vien' });
    }
    res.json({ message: 'Da xoa sinh vien', student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas da ket noi');
    app.listen(port, () => {
      console.log(`Backend dang chay tai cong ${port}`);
    });
  })
  .catch((error) => {
    console.error('Khong the ket noi MongoDB Atlas:', error.message);
    process.exit(1);
  });