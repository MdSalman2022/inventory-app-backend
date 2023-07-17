const employee_model = require("../schemas/employeeSchema").employee;

exports.getEmployee = async (req, res, next) => {
  try {
    const { sellerid } = req.query;

    let query = { sellerId: sellerid };

    const employee = await employee_model.find(query);

    // console.log(employee);

    if (employee) {
      res.json({
        success: true,
        message: "Employee fetched successfully",
        employee,
      });
    } else {
      res.json({ success: false, message: "Employee not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const { username, email, password, sellerId, status, role, timestamp } =
      req.body;

    const employee = new employee_model({
      username,
      email,
      password,
      sellerId,
      status,
      role,
      timestamp,
    });

    const result = await employee.save();

    if (result) {
      res.json({
        success: true,
        message: "Employee created successfully",
        result,
      });
    }
  } catch (exception) {
    console.log(exception);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.query;

    const { username, email, password, sellerId, status, role, timestamp } =
      req.body;

    const employee = await employee_model.findById(id);

    if (employee) {
      employee.username = username;
      employee.email = email;
      employee.password = password;
      employee.sellerId = sellerId;
      employee.status = status;
      employee.role = role;
      employee.timestamp = timestamp;

      const result = await employee.save();

      if (result) {
        res.json({
          success: true,
          message: "Employee updated successfully",
          result,
        });
      }
    } else {
      res.json({ success: false, message: "Employee not found" });
    }
  } catch (exception) {
    console.log(exception);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.query;

    const employee = await employee_model.findById(id);

    if (employee) {
      const result = await employee_model.findByIdAndDelete(id);

      if (result) {
        res.json({
          success: true,
          message: "Employee deleted successfully",
          result,
        });
      }
    } else {
      res.json({ success: false, message: "Employee not found" });
    }
  } catch (exception) {
    console.log(exception);
  }
};
