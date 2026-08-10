import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as complaintApi from "../../api/complaintApi";

import ErrorMessage from "../../components/ErrorMessage";

const CreateComplaint = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const data = {
        ...form,
      };

      await complaintApi.createComplaint(data);

      navigate("/user/complaints");
    } catch (err) {
      console.error(
        "Failed to create complaint:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    navigate("/user/complaints");
  };

  return (
    <div className="create-complaint-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="create-complaint-header">

        <div>

          <span className="create-eyebrow">
            SERVICE REQUEST
          </span>

          <h1>
            Submit a Complaint
          </h1>

          <p>
            Tell us what happened and we will
            make sure your complaint reaches
            the right department.
          </p>

        </div>

        <div className="create-header-icon">
          📝
        </div>

      </div>


      {/* =====================================
          PROGRESS
      ===================================== */}

      <div className="complaint-steps">

        <div className="complaint-step active">
          <div className="step-number">
            1
          </div>

          <div>
            <strong>
              Complaint Details
            </strong>

            <span>
              Describe your issue
            </span>
          </div>
        </div>

        <div className="step-line" />

        <div className="complaint-step">
          <div className="step-number">
            2
          </div>

          <div>
            <strong>
              Review
            </strong>

            <span>
              Submit your complaint
            </span>
          </div>
        </div>

        <div className="step-line" />

        <div className="complaint-step">
          <div className="step-number">
            3
          </div>

          <div>
            <strong>
              Track
            </strong>

            <span>
              Follow its progress
            </span>
          </div>
        </div>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="create-complaint-error">
          <ErrorMessage error={error} />
        </div>
      )}


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <form
        className="create-complaint-layout"
        onSubmit={submit}
      >

        {/* ===================================
            LEFT SIDE
        =================================== */}

        <div className="create-form-main">

          {/* BASIC INFORMATION */}

          <section className="create-form-card">

            <div className="create-card-header">

              <div className="create-card-icon">
                📋
              </div>

              <div>
                <span>
                  STEP 01
                </span>

                <h2>
                  Complaint Information
                </h2>

                <p>
                  Provide the basic details about
                  your complaint.
                </p>
              </div>

            </div>


            {/* TITLE */}

            <div className="form-field">

              <label htmlFor="title">
                Complaint Title
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Street light not working"
                maxLength={150}
                required
              />

              <div className="field-footer">
                <span>
                  Use a short and clear title.
                </span>

                <span>
                  {form.title.length}/150
                </span>
              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="form-field">

              <label htmlFor="description">
                Description
                <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Please explain the problem in detail. Include important information such as what happened, when it happened, and where it happened."
                rows={7}
                maxLength={2000}
                required
              />

              <div className="field-footer">
                <span>
                  More details help us resolve
                  your complaint faster.
                </span>

                <span>
                  {form.description.length}/2000
                </span>
              </div>

            </div>

          </section>


          {/* CATEGORY + PRIORITY */}

          <section className="create-form-card">

            <div className="create-card-header">

              <div className="create-card-icon">
                🏷️
              </div>

              <div>
                <span>
                  STEP 02
                </span>

                <h2>
                  Classification
                </h2>

                <p>
                  Help us understand the type and
                  urgency of your complaint.
                </p>
              </div>

            </div>


            <div className="classification-grid">

              {/* CATEGORY */}

              <div className="form-field">

                <label htmlFor="category">
                  Category
                  <span>*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="ROADS">
                    Roads & Infrastructure
                  </option>

                  <option value="WATER">
                    Water Supply
                  </option>

                  <option value="ELECTRICITY">
                    Electricity
                  </option>

                  <option value="SANITATION">
                    Sanitation
                  </option>

                  <option value="PUBLIC_SAFETY">
                    Public Safety
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>

              </div>


              {/* PRIORITY */}

              <div className="form-field">

                <label>
                  Priority
                  <span>*</span>
                </label>

                <div className="priority-options">

                  <label
                    className={
                      form.priority === "LOW"
                        ? "priority-option selected low"
                        : "priority-option low"
                    }
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="LOW"
                      checked={
                        form.priority === "LOW"
                      }
                      onChange={handleChange}
                    />

                    <div>
                      <strong>
                        Low
                      </strong>

                      <span>
                        General issue
                      </span>
                    </div>
                  </label>


                  <label
                    className={
                      form.priority === "MEDIUM"
                        ? "priority-option selected medium"
                        : "priority-option medium"
                    }
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="MEDIUM"
                      checked={
                        form.priority === "MEDIUM"
                      }
                      onChange={handleChange}
                    />

                    <div>
                      <strong>
                        Medium
                      </strong>

                      <span>
                        Needs attention
                      </span>
                    </div>
                  </label>


                  <label
                    className={
                      form.priority === "HIGH"
                        ? "priority-option selected high"
                        : "priority-option high"
                    }
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="HIGH"
                      checked={
                        form.priority === "HIGH"
                      }
                      onChange={handleChange}
                    />

                    <div>
                      <strong>
                        High
                      </strong>

                      <span>
                        Urgent issue
                      </span>
                    </div>
                  </label>

                </div>

              </div>

            </div>

          </section>


          {/* LOCATION */}

          <section className="create-form-card">

            <div className="create-card-header">

              <div className="create-card-icon">
                📍
              </div>

              <div>
                <span>
                  STEP 03
                </span>

                <h2>
                  Location
                </h2>

                <p>
                  Tell us where the issue occurred.
                </p>
              </div>

            </div>


            <div className="form-field">

              <label htmlFor="location">
                Complaint Location
                <span>*</span>
              </label>

              <div className="location-input">

                <span>
                  📍
                </span>

                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Example: Main Road, Ward 5"
                  maxLength={255}
                  required
                />

              </div>

              <div className="field-footer">
                <span>
                  Provide a location that helps
                  staff identify the issue.
                </span>

                <span>
                  {form.location.length}/255
                </span>
              </div>

            </div>

          </section>

        </div>


        {/* ===================================
            RIGHT SIDE
        =================================== */}

        <aside className="create-form-sidebar">

          {/* SUBMIT CARD */}

          <div className="submit-card">

            <div className="submit-card-icon">
              🚀
            </div>

            <h2>
              Ready to submit?
            </h2>

            <p>
              Review your information before
              submitting your complaint.
            </p>

            <button
              type="submit"
              className="submit-complaint-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Complaint
                  <span>→</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="cancel-complaint-btn"
              onClick={cancel}
              disabled={loading}
            >
              Cancel
            </button>

          </div>


          {/* TIPS */}

          <div className="complaint-tips-card">

            <div className="tips-header">
              <span>
                💡
              </span>

              <h3>
                Helpful Tips
              </h3>
            </div>

            <ul>

              <li>
                <span>✓</span>
                Give your complaint a clear title.
              </li>

              <li>
                <span>✓</span>
                Explain the problem in detail.
              </li>

              <li>
                <span>✓</span>
                Provide an accurate location.
              </li>

              <li>
                <span>✓</span>
                Select the correct priority.
              </li>

            </ul>

          </div>


          {/* SLA INFO */}

          <div className="sla-info-card">

            <div className="sla-info-icon">
              ⏱
            </div>

            <div>

              <strong>
                What happens next?
              </strong>

              <p>
                Your complaint will be reviewed
                and assigned to the appropriate
                department.
              </p>

            </div>

          </div>

        </aside>

      </form>

    </div>
  );
};

export default CreateComplaint;