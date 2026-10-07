import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const NotFound = () => {
  return (
    <div>
      <h1>404 Not Found</h1><br />
      <Link to={'/'}><Button type="button" variant="outline" size="sm">Home</Button></Link>
    </div>
  )
};

export default NotFound
