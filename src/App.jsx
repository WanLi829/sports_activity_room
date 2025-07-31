import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home_page from './pages_of_room/Home_page'
import Login_page from './pages_of_room/Login_page'
import Register_page from './pages_of_room/Register_page'
import Page_404 from './pages_of_room/404'
import Activity_detail_page from './pages_of_room/activity_detail_page'
import ActivityManage_page from './pages_of_room/activity_manage_page'
import Order_page from './pages_of_room/Order_page'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home_page />} />
        <Route path="/login" element={<Login_page />} />
        <Route path="/register" element={<Register_page />} />
        <Route path="/activity/:id" element={<Activity_detail_page />} />
        <Route path="*" element={<Page_404 />} />
        <Route path="/manage" element={<ActivityManage_page />} />
        <Route path="/orders" element={<Order_page />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App