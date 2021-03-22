// React & Component
import { useState } from 'react';
import './App.css';
import Employees from './components/employees/Employees';
import AddEmployeeModal from './components/modal/AddEmployeeModal';
import Header from './components/Header';

function App () {

  const [showModal, setShowModal] = useState(false);
  const [addedEmployee, setAddedEmployee] = useState({});

  const handleToggleModal = () => setShowModal (preValue => ! preValue);
  const handleAddEmployee = (addedEmployee) => setAddedEmployee(addedEmployee);
  
  return (
    <div className="App">

      <Header />

      <div onClick={handleToggleModal} className="plus fas fa-plus-circle" />

      <AddEmployeeModal showModal={showModal} handleToggleModal={handleToggleModal} handleAddEmployee={handleAddEmployee} />

      {/* <Employees addedEmployee={addedEmployee}  /> */}
    </div>
  );
}

export default App;
