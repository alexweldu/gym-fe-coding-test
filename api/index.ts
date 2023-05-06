import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import jwt from "jsonwebtoken";
import * as yup from "yup";
const cors = require("cors");

interface Gym {
  id: number;
  name: string;
  location: Location;
  orgNumber: string;
  password: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  startedOn: number;
  address: Location;
  gymId: number;
}

interface Location {
  street: string;
  city: string;
  state: string;
  zip: string;
}

// validation schema
const memberSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.object({
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
  }),
});

const app = express();
const port = process.env.PORT || 4000;
const secretKey = "my-secret-key";

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware to parse request body
app.use(bodyParser.json());

// Load gyms
let gyms: Gym[] = [];
try {
  const gymsData = fs.readFileSync("./data/gyms.json", "utf-8");
  gyms = JSON.parse(gymsData);
} catch (error) {
  console.error("Error loading gyms data:", error);
}

// Load members
let members: Member[] = [];
try {
  const membersData = fs.readFileSync("./data/members.json", "utf-8");
  members = JSON.parse(membersData);
} catch (error) {
  console.error("Error loading members data:", error);
}

// Middleware to protect member endpoints with JWT authentication
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.sendStatus(401);

    if (typeof decoded === "object" && decoded.hasOwnProperty("orgNumber")) {
      req.body.orgNumber = decoded.orgNumber;
      req.body.gymId = gyms.find((g) => g.orgNumber === decoded.orgNumber)?.id;
    }

    next();
  });
};

// Gym Member Endpoints
// Login endpoint that returns a JWT token
app.post("/login", (req: Request, res: Response) => {
  const { orgNumber, password } = req.body;
  const gym = gyms.find(
    (g) => g.orgNumber === orgNumber && g.password === password
  );
  if (!gym) {
    return res.status(401).send("Invalid organization number or password");
  }

  const token = jwt.sign({ orgNumber: gym.orgNumber }, secretKey);
  res.json({ token });
});

// Get full info of authenticated gym
app.get("/gym", authenticateToken, (req, res) => {
  const gym = gyms.find((g) => g.id === parseInt(req.body.gymId));
  if (gym) {
    res.json(gym);
  } else {
    res.status(404).send("Gym not found");
  }
});

// Gym Member Endpoints
// Get all members of the authenticated gym
app.get("/members", authenticateToken, (req, res) => {
  const gymMembers = members.filter((m) => m.gymId === req.body.gymId);
  res.json(gymMembers);
});

// Get a specific member of the authenticated gym by ID
app.get("/members/:id", authenticateToken, (req, res) => {
  const member = members.find(
    (m) => m.id === parseInt(req.params.id) && m.gymId === req.body.gymId
  );
  if (member) {
    res.json(member);
  } else {
    res.status(404).send("Member not found");
  }
});

// Create a new member for the authenticated gym
app.post("/members", authenticateToken, (req, res) => {
  try {
    memberSchema.validateSync(req.body, { abortEarly: false });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message, error: error.errors });
  }

  const member: Member = {
    id: members.length + 1,
    name: req.body.name,
    email: req.body.email,
    gymId: req.body.gymId,
    startedOn: Date.now(),
    address: {
      street: req.body.address.street,
      city: req.body.address.city,
      state: req.body.address.state,
      zip: req.body.address.zip,
    },
  };
  members.push(member);
  fs.writeFileSync("./data/members.json", JSON.stringify(members, null, 2));
  res.json(member);
});

// Update an existing member of the authenticated gym
app.put("/members/:id", authenticateToken, (req, res) => {
  try {
    memberSchema.validateSync(req.body, { abortEarly: false });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }

  const memberIndex = members.findIndex(
    (m) => m.id === parseInt(req.params.id) && m.gymId === req.body.gymId
  );
  if (memberIndex !== -1) {
    members[memberIndex].name = req.body.name;
    members[memberIndex].email = req.body.email;
    members[memberIndex].address.street = req.body.address.street;
    members[memberIndex].address.city = req.body.address.city;
    members[memberIndex].address.state = req.body.address.state;
    members[memberIndex].address.zip = req.body.address.zip;
    fs.writeFileSync("./data/members.json", JSON.stringify(members, null, 2));
    res.json(members[memberIndex]);
  } else {
    res.status(404).send("Member not found");
  }
});

// Delete an existing member of the authenticated gym
app.delete("/members/:id", authenticateToken, (req, res) => {
  const memberIndex = members.findIndex(
    (m) => m.id === parseInt(req.params.id) && m.gymId === req.body.gymId
  );
  if (memberIndex !== -1) {
    members.splice(memberIndex, 1);
    fs.writeFileSync("./data/members.json", JSON.stringify(members, null, 2));
    res.sendStatus(204);
  } else {
    res.status(404).send("Member not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
