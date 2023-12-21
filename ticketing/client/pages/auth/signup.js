export default () => {
  return (
    <form>
      <hi>Sign Up</hi>
      <div className="form-group">
        <label>Email</label>
        <input className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" className="form-control" />
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
