// React & Component
import { useState, useEffect } from 'react';
import './Employees.css';
import AddEmployeeModal from '../modal/AddEmployeeModal';
import EditEmployeeModal from '../modal/EditEmployeeModal';
import DeleteEmployeeModal from '../modal/DeleteEmployeeModal';

// JavaScript Plugin
import $api from 'axios';
import rq from 'random-quotes';
import { v4 as uuidv4 } from 'uuid';

// CSS Framework
// import { Card } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

const useStyles = makeStyles (theme => ({
  root: {
    padding: theme.spacing (2),
  },
  card: {
    height: '100%'
  },
  sub: {
    // marginBottom: theme.spacing (5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icons: {
    textAlign: 'right',
  },
  add: {
    position: 'fixed',
    bottom: '50px',
    right: '50px',
  }
}));

const Employees = () => {

  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState (false);
  const [employees, setEmployees] = useState([]);
  const [addedEmployee, setAddedEmployee] = useState({});
  const [editEmployee, setEditEmployee] = useState({});
  const [deleteEmployee, setDeleteEmployee] = useState({});

  // Show modal & pass selected employee data to modal.
  const handleEditModalData = (employee, i) => {

    setEditEmployee ({...employee, order: i});
  };

  const handleDeleteModalData = (employee, i) => {
    setDeleteEmployee ({...employee, order: i});
  }

  const handleToggleModal = () => {
    return setOpenAddEmployeeModal (prevState => ! prevState);
  }
  
  const handleAddEmployee = (addedEmployee) => setAddedEmployee (addedEmployee);

  // Update selected employee's data.
  const handleEditEmployee = (editedEmployee) => {

    const pos = editEmployee.order;

    setEmployees(prevEmployees => {

      prevEmployees[pos].name = editedEmployee.name;
      prevEmployees[pos].quote = editedEmployee.quote;

      const updatedEmployees = [...prevEmployees];
      return updatedEmployees;
    });
  };

  // Delete selected employee's data.
  const handleDeleteEmployee = () => {

    const pos = editEmployee.order;

    setEmployees(prevEmployees => {

      prevEmployees.splice (pos, 1);

      const updatedEmployees = [...prevEmployees];
      return updatedEmployees;
    });
  };

  useEffect(() => {

    // Retrieve (initialize) employees' data.
    $api.get('https://randomuser.me/api/?results=10')
      .then (res => {
        
        const cleanSource = [...res.data.results];
        const employeeList = cleanSource.map(employee => {
          return {name: employee.name, quote: rq().body, id: uuidv4()};
        });
        
        setEmployees(employeeList);
      });
  }, []);

  useEffect(() => {

    if (Object.keys(addedEmployee).length <= 0) 
      return;

    setEmployees ([...employees, addedEmployee]);

  }, [addedEmployee]);

  const classes = useStyles ();
  
  return (
    <div className="employees">
      <Grid container>
        {
          employees.map ((employee, i) => (
            <Grid key={employee.id} className={classes.root} item xs={3}>
              <Card className={classes.card}>
                <CardHeader title={employee.name.first + ' ' + employee.name.last} />
                <Divider variant="middle" />
                <CardContent>
                  <p className={classes.sub}>My Declaration to <br /> Win The Prize:</p>
                  {employee.quote}
                </CardContent>

                <Box className={classes.icons}>
                  <IconButton onClick={() => handleEditModalData (employee, i)}>
                    <CreateRoundedIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDeleteModalData (employee, i)}>
                    <DeleteForeverRoundedIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))
        }

        <Box onClick={handleToggleModal} className={`${classes.add} plus fas fa-plus-circle`} />
      </Grid>

      <AddEmployeeModal open={openAddEmployeeModal} handleToggleModal={handleToggleModal} handleAddEmployee={handleAddEmployee} />

      <EditEmployeeModal target={editEmployee} handleEditEmployee={handleEditEmployee} />

      <DeleteEmployeeModal target={deleteEmployee} handleDeleteEmployee={handleDeleteEmployee} />
    </div>
  );
}

export default Employees;
