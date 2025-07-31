'use client';

export default function Footer() {
  return (
    <footer className="main-footer text-center">
    {/* <div class="float-right d-none d-sm-block">
      <b>Version</b> 3.2.0
    </div> */}
    <strong>Copyright &copy; {new Date().getFullYear()} <a href="#">ARCGATE COMPLIANCE MONITORING</a>.</strong> All rights reserved.
  </footer>
  );
}
