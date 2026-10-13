import "./index.css";
import BookList from "./components/books/BookList.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound.tsx";
import Layout from "./components/Layout.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RegisterPage from "./components/auth/RegisterPage.tsx";
import StudentList from "./components/students/StudentList.tsx";
import StudentAddPage from "./components/students/StudentAddPage.tsx";
import IssueListPage from "./components/issues/IssueListPage.tsx";
import IssueBookPage from "./components/issues/IssueBookPage.tsx";
import AddBookPage from "./components/books/AddBookPage.tsx";
import EditBookPage from "./components/books/EditBookPage.tsx";
import StudentEditPage from "./components/students/StudentEditPage.tsx";
import ChangePasswordPage from "./components/auth/ChangePasswordPage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/books" replace />} />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute>
                      <BookList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books/add"
                  element={
                    <ProtectedRoute>
                      <AddBookPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditBookPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/students"
                  element={
                    <ProtectedRoute>
                      <StudentList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/students/add"
                  element={
                    <ProtectedRoute>
                      <StudentAddPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/students/edit/:id"
                  element={
                    <ProtectedRoute>
                      <StudentEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues"
                  element={
                    <ProtectedRoute>
                      <IssueListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues/new"
                  element={
                    <ProtectedRoute>
                      <IssueBookPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-students"
                  element={<Navigate to="/students" replace />}
                />
                <Route
                  path="/dashboard"
                  element={<Navigate to="/" replace />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
