import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SelectedDepartment from './pro_f/pages/SelectedDepartment/SelectedDepartment';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/selectedDepartment" 
            element={<SelectedDepartment />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import MainPage from './pages/MainPage';
// import RePage from './pro_f/pages/RePage/RePage';
// import Nav from './pro_f/component/Nav/Nav';
// import ProgramList from './pages/ProgramList';
// import CompleteProgram from './pro_f/pages/CompleteProgram/CompleteProgram';
// import CompleteDetail from './pro_f/pages/CompleteDetail/CompleteDetail';
// import EvaluationDetail from './pages/EvaluationDetail';
// import ProgramRegistration from './pages/ProgramRegistration';
// import ApplicationProgram from './pages/ApplicationProgram';
// import selectedDepartent from './pro_f/pages/SelectedDepartment/selectedDepartment';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//       <Route
//         path='/selectedDepartment'
//         element={<selectedDepartent/>}/>
//       </Routes>
 
//       {/* <div>
//         <Nav/>
//         <Routes>
//           <Route path="/" element={<MainPage />} />
//           <Route 
//             path="/main" 
//             element={
//               localStorage.getItem('user') ? <MainPage /> : <Navigate to="/login" replace />
//             } 
//           />
//           <Route 
//             path="/repage" 
//             element={
//               localStorage.getItem('user') ? <RePage /> : <Navigate to="/login" replace />
//             }
//           />
//           <Route 
//             path="/programlist" 
//             element={
//               localStorage.getItem('user') ? <ProgramList /> : <Navigate to="/login" replace />
//             }
//           />
//           <Route 
//             path="/applicationprogram/:programId" 
//             element={
//               localStorage.getItem('user') ? <ApplicationProgram /> : <Navigate to="/login" replace />
//             }
//           />
//           <Route 
//             path="/programregistration" 
//             element={
//               localStorage.getItem('user') ? <ProgramRegistration /> : <Navigate to="/login" replace />
//             }
//           />
//           <Route 
//             path="/completeprogram" 
//             element={
//               localStorage.getItem('user') ? <CompleteProgram /> : <Navigate to="/login" replace />
//             }
//           />
//           <Route 
//             path="/completedetail/:programId" 
//             element={
//               localStorage.getItem('user') ? <CompleteDetail /> : <Navigate to="/login" replace />
//             }
//           />
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route 
//             path="/evaluationdetail/:programId/:studentId" 
//             element={
//               localStorage.getItem('user') ? <EvaluationDetail /> : <Navigate to="/login" replace />
//             }
//           />
//         </Routes>
//       </div> */}
//     </Router>
//   );
// };

// export default App;

// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import LoanApplication from './student/LoanApplication';

// // function App() {
// //   return (
// //     <Router>
// //       <div>
// //         <Routes>
// //           <Route path="/" element={<LoanApplication />} />
// //           {/* <Route 
// //             path="/loan-application" 
// //             element={
// //               localStorage.getItem('user') ? <LoanApplication /> : <Navigate to="/login" replace />
// //             } 
// //           /> */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;

