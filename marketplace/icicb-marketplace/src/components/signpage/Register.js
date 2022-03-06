import React from "react";

function Register(props) {
  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>

      <section
        id="subheader"
        className="text-light"
        data-bgimage="url(images/background/subheader-dark.jpg) top"
      >
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Register</h1>
                <p>Anim pariatur cliche reprehenderit</p>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <h3>Don't have an account? Register now.</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>

              <div className="spacer-10"></div>

              <form
                name="contactForm"
                id="contact_form"
                className="form-border"
                method="post"
                action="blank.php"
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Email Address:</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Choose a Username:</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Password:</label>
                      <input
                        type="text"
                        name="password"
                        id="password"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Re-enter Password:</label>
                      <input
                        type="text"
                        name="re-password"
                        id="re-password"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div id="submit" className="pull-left">
                      <input
                        type="submit"
                        id="send_message"
                        value="Register Now"
                        className="btn btn-main color-2"
                      />
                    </div>

                    <div id="mail_success" className="success">
                      Your message has been sent successfully.
                    </div>
                    <div id="mail_fail" className="error">
                      Sorry, error occured this time sending your message.
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
