import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../utils/Header";
import Footer from "../components/frontComponents/Footer";
import privacyHtml from "../content/privacy-policy.html?raw";
import { BRAND_NAME } from "../constants/brand.js";
import "./privacy-policy.css";

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1] : html;
}

function stripNonUSSections(bodyHtml) {
  // Keep US + CA (N), remove Europe (O) and Canada (P) sections.
  // Source HTML uses <p> headers like: "O. ADDITIONAL INFORMATION FOR EUROPEAN VISITORS".
  return bodyHtml
    .replace(
      /<p[^>]*>\s*O\.\s*ADDITIONAL INFORMATION FOR EUROPEAN VISITORS[\s\S]*?(?=<p[^>]*>\s*P\.\s*ADDITIONAL INFORMATION FOR CANADIAN RESIDENTS)/i,
      ""
    )
    .replace(
      /<p[^>]*>\s*P\.\s*ADDITIONAL INFORMATION FOR CANADIAN RESIDENTS[\s\S]*/i,
      ""
    );
}

export default function PrivacyPolicy() {
  const innerHtml = useMemo(() => {
    const body = extractBody(privacyHtml);
    return stripNonUSSections(body);
  }, []);

  return (
    <div className="privacy-policy-page">
      <Header />
      <section className="privacy-policy-main n1-3rd-bg-color py-8 py-md-12">
        <div className="container-fluid cus-padding" style={{ maxWidth: "920px", margin: "0 auto" }}>
          <nav className="privacy-policy-toolbar mb-4 d-flex flex-wrap gap-3 align-items-center">
            <Link to="/" className="n4-color text-decoration-none fw-semibold">
              ← Home
            </Link>
            <Link to="/contact" className="n4-color text-decoration-none">
              Contact us to exercise privacy rights
            </Link>
          </nav>
          <h1 className="fs-two n4-color mb-6">{BRAND_NAME} — Privacy Notice</h1>
          <div
            className="privacy-policy-body n4-color"
            dangerouslySetInnerHTML={{ __html: innerHtml }}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
