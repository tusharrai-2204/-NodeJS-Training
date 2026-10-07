import "./index.css";
import BookList from "./components/BookList.tsx";
import StudentDetails from "./components/StudentDetails.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound.tsx";
import StudentPage from "./pages/StudentPage.tsx";
import AddBookForm from "./components/AddBookForm.tsx";
import Users from "./components/Users.tsx";
import UserPosts from "./components/UserPosts.tsx";
import Layout from "./components/Layout.tsx";
import PageTracker from "./components/PageTracker.tsx";
import Home from "./components/Home.tsx";
import LoginPage from "./components/LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RegisterPage from "./components/RegisterPage.tsx";

function App() {
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
                <Route
                  path="/"
                  element={
                    <Home />
                  }
                />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute>
                      <div className="space-y-0">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h1 className="text-2xl font-bold tracking-tight">Books</h1>
                            <p className="text-sm text-muted-foreground mt-1">Manage your library catalog</p>
                          </div>
                          <AddBookForm />
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
                      <StudentPage />
                    </ProtectedRoute>
                  }
                >
                  <Route path=":id" element={<StudentDetails />} />
                </Route>
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserPosts />} />
                <Route
                  path="/all-students"
                  element={<Navigate to="/students" replace />}
                />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
