// React & Component
import { useState, useEffect } from 'react';
import './Employees.css';
import EmployeeEditModal from '../modal/EmployeeEditModal/EmployeeEditModal';
import EmployeeDeleteModal from '../modal/EmployeeDeleteModal/EmployeeDeleteModal';

// JavaScript Plugin
import $api from 'axios';
import rq from 'random-quotes';
import { v4 as uuidv4 } from 'uuid';

// CSS Framework
import { Card } from 'react-bootstrap';

function Employees (props) {

  const [employees, setEmployees] = useState ([]);
  const [trigger, setTrigger] = useState (0);
  const [modalType, setModalType] = useState (null);
  const [editTarget, setEditTarget] = useState ({});
  // const [deleteTarget, setDeleteTarget] = useState ({});

  // Show modal & pass selected employee data to modal.
  const handleEditModalData = (dataset, i) => {

    setEditTarget ({...dataset.employee, order: i});

    console.log (dataset.type);

    // Trigger direct type of children show or hide modal by update trigger count.
    setTrigger (trigger + 1);
    setModalType (dataset.type);
  };

  // Update selected employee's data.
  const handleEditEmployee = (editedEmployee) => {

    const pos = editTarget.order;

    setEmployees (prevEmployees => {

      prevEmployees[pos].name = editedEmployee.name;
      prevEmployees[pos].quote = editedEmployee.quote;

      const updatedEmployees = [...prevEmployees];
      return updatedEmployees;
    });
  };

  // Delete selected employee's data.
  const handleDeleteEmployee = () => {

    const pos = editTarget.order;

    setEmployees (prevEmployees => {

      prevEmployees.splice (pos, 1);

      console.log (prevEmployees);

      const updatedEmployees = [...prevEmployees];
      return updatedEmployees;
    });
  };

  useEffect (() => {

    // Retrieve (initialize) employees' data.
    $api.get ('https://randomuser.me/api/?results=10')
      .then (res => {
        
        const cleanSource = [...res.data.results];
        const employeeList = cleanSource.map (employee => {
          return { name: employee.name, quote: rq ().body, id: uuidv4 () };
        });
        
        setEmployees (employeeList);
      });
  }, []);

  useEffect (() => {

    console.log (props);

    if (! props.addedEmployee)
      return;

    setEmployees ([...employees, props.addedEmployee]);

  }, [props.addedEmployee]);
  
  return (
    <div className="employees">
      <div className="container">
        <div className="row">
          {
            employees.map ((employee, i) => (
              <Card
              bg="light"
              key={ employee.id }
              text="dark"
              className='mb-2 position-relative'
              >
                <Card.Header className="font-weight-bold">{ employee.name.first } { employee.name.last }</Card.Header>
                <Card.Body>
                  <Card.Text className="font-weight-bold">
                    My Declaration to Win The Prize:
                  </Card.Text>
                  <Card.Text className="text-left">
                    { employee.quote }
                  </Card.Text>
                </Card.Body>

                <div className="editor position-absolute">
                  <i onClick={ () => handleEditModalData ( { employee, type: 'edit' }, i) } className="fas fa-edit edit"></i>
                  <i onClick={ () => handleEditModalData ( { employee, type: 'delete' }, i) }  className="fas fa-trash trash"></i>
                </div>
              </Card>
            ))
          }
        </div>
      </div>

      <EmployeeEditModal triggerCount={ trigger } modal={ modalType } employee={ editTarget } handleEdit={ handleEditEmployee }></EmployeeEditModal>
      <EmployeeDeleteModal triggerCount={ trigger } modal={ modalType } employee={ editTarget } handleDelete={ handleDeleteEmployee }></EmployeeDeleteModal>
    </div>
  );
}

export default Employees;
