import "./index.css";
import BookList from "./components/books/BookList.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound.tsx";
import AddBookForm from "./components/books/AddBookForm.tsx";
import Layout from "./components/Layout.tsx";
import PageTracker from "./components/PageTracker.tsx";
import Home from "./components/Home.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RegisterPage from "./components/auth/RegisterPage.tsx";
import StudentList from "./components/students/StudentList.tsx";
import StudentAddPage from "./components/students/StudentAddPage.tsx";
import IssueListPage from "./components/issues/IssueListPage.tsx";
import IssueBookPage from "./components/issues/IssueBookPage.tsx";
import { useAuthStore } from "./store/authStore.ts";

function App() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  return (
    <>
      <PageTracker />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute>
                      <div className="space-y-0">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                              Books
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                              Manage your library catalog
                            </p>
                          </div>
                          {isAdmin && <AddBookForm />}
                        </div>
                        <BookList />
                      </div>
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
