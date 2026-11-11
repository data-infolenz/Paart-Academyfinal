import type { Handle } from "remix/component"
import { SendIcon, ShieldCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Button, Input, Select, Text, TextArea } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCard,
  AcademicPageBanner,
  AcademicSection,
  acadSerif
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface AdmissionApplyPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  courses: CourseItem[]
  selectedCourse?: string
  honeypotFields?: Record<string, string>
  error?: string | null
  values?: Record<string, string>
}

export function AdmissionApplyPage(handle: Handle<AdmissionApplyPageProps>) {
  return () => {
    const {
      user,
      settings,
      courses,
      selectedCourse = "",
      honeypotFields,
      error,
      values = {}
    } = handle.props

    const defaultCourse = values.courseInterested || selectedCourse

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicPageBanner
          rubric="Student Admissions Desk"
          title="Student Admission Application Form"
          description="Complete the student registration form below to apply for classroom coaching, weekend batches, or skill certification at PAART Academy, Puliyangudi."
          breadcrumbs={[{ label: "Admission Form" }]}
        />

        <AcademicSection>
          <div mix={[u.maxWidth("56rem"), u.mi("auto")]}>
            {error && (
              <div
                role="alert"
                mix={[
                  u.p(4),
                  u.mbe(5),
                  u.rounded("lg"),
                  u.border({ width: 1, color: "danger" }),
                  u.bg("danger.tint")
                ]}
              >
                <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("danger"), u.m(0)]}>
                  {error}
                </Text>
              </div>
            )}

            <form
              method="POST"
              action={routes.admissions.submit.href()}
              encType="multipart/form-data"
              mix={[
                acadCard("primary"),
                u.vstack({ gap: 6 }),
                u.p(6),
                u.media("(min-width: 48rem)", u.p(8))
              ]}
            >
              {honeypotFields && (
                <div aria-hidden="true" mix={[u.visuallyHidden()]}>
                  {Object.entries(honeypotFields).map(([k, v]) => (
                    <input
                      key={k}
                      type="text"
                      name={k}
                      defaultValue={v}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  ))}
                </div>
              )}

              {/* Section 1: Personal Information */}
              <div mix={[u.vstack({ gap: 4 })]}>
                <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                  1. Student &amp; Contact Particulars
                </h2>

                <div
                  mix={[
                    u.grid(),
                    u.gap(4),
                    u.media(
                      "(min-width: 44rem)",
                      u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                    )
                  ]}
                >
                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Student Full Name *
                    </Text>
                    <Input
                      name="studentName"
                      required
                      defaultValue={values.studentName ?? ""}
                      placeholder="As per SSLC / Degree certificate"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Parent / Guardian Name *
                    </Text>
                    <Input
                      name="parentName"
                      required
                      defaultValue={values.parentName ?? ""}
                      placeholder="Father / Mother / Guardian name"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Date of Birth *
                    </Text>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      required
                      defaultValue={values.dateOfBirth ?? ""}
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Gender *</Text>
                    <Select name="gender" required>
                      <Select.Option value="" selected={!values.gender}>
                        Select gender...
                      </Select.Option>
                      <Select.Option value="Male" selected={values.gender === "Male"}>
                        Male
                      </Select.Option>
                      <Select.Option value="Female" selected={values.gender === "Female"}>
                        Female
                      </Select.Option>
                      <Select.Option value="Other" selected={values.gender === "Other"}>
                        Other
                      </Select.Option>
                    </Select>
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Mobile Number *
                    </Text>
                    <Input
                      name="mobile"
                      type="tel"
                      required
                      defaultValue={values.mobile ?? ""}
                      placeholder="+91 98765 43210"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      WhatsApp Number
                    </Text>
                    <Input
                      name="whatsapp"
                      type="tel"
                      defaultValue={values.whatsapp ?? ""}
                      placeholder="Same as mobile if left blank"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Email Address
                    </Text>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={values.email ?? ""}
                      placeholder="student@example.com"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Town / City *
                    </Text>
                    <Input
                      name="city"
                      required
                      defaultValue={values.city ?? "Puliyangudi"}
                      placeholder="Puliyangudi"
                    />
                  </label>
                </div>

                <div
                  mix={[
                    u.grid(),
                    u.gap(4),
                    u.media("(min-width: 44rem)", u.raw({ gridTemplateColumns: "2fr 1fr 1fr" }))
                  ]}
                >
                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Residential Street Address *
                    </Text>
                    <Input
                      name="address"
                      required
                      defaultValue={values.address ?? ""}
                      placeholder="Door No, Street, Area"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>District *</Text>
                    <Input name="district" required defaultValue={values.district ?? "Tenkasi"} />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Pincode *</Text>
                    <Input
                      name="pincode"
                      required
                      defaultValue={values.pincode ?? "627855"}
                      placeholder="627855"
                    />
                  </label>
                </div>
                <input type="hidden" name="state" value="Tamil Nadu" />
              </div>

              {/* Section 2: Course & Academic Qualification */}
              <div
                mix={[
                  u.vstack({ gap: 4 }),
                  u.pbs(5),
                  u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                  2. Programme Selection &amp; Educational Qualification
                </h2>

                <div
                  mix={[
                    u.grid(),
                    u.gap(4),
                    u.media(
                      "(min-width: 44rem)",
                      u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                    )
                  ]}
                >
                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Course Applying For *
                    </Text>
                    <Select name="courseInterested" required>
                      <Select.Option value="" selected={!defaultCourse}>
                        Select target examination...
                      </Select.Option>
                      {courses.map((c) => (
                        <Select.Option
                          key={c.id}
                          value={c.title}
                          selected={defaultCourse === c.title || defaultCourse === c.slug}
                        >
                          {c.title} ({c.category})
                        </Select.Option>
                      ))}
                      <Select.Option
                        value="NMMS School Scholarship"
                        selected={defaultCourse === "NMMS School Scholarship"}
                      >
                        NMMS School Scholarship
                      </Select.Option>
                      <Select.Option
                        value="Typewriting / Steno / Basic Computer"
                        selected={defaultCourse === "Typewriting / Steno / Basic Computer"}
                      >
                        Typewriting / Steno / Basic Computer
                      </Select.Option>
                    </Select>
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Preferred Batch *
                    </Text>
                    <Select name="preferredBatch" required>
                      <Select.Option
                        value="Regular Weekday"
                        selected={
                          (values.preferredBatch ?? "Regular Weekday") === "Regular Weekday"
                        }
                      >
                        Regular Weekday Batch
                      </Select.Option>
                      <Select.Option
                        value="Weekend Batch"
                        selected={values.preferredBatch === "Weekend Batch"}
                      >
                        Weekend Batch (Sat &amp; Sun)
                      </Select.Option>
                      <Select.Option
                        value="Morning Track + Classroom"
                        selected={values.preferredBatch === "Morning Track + Classroom"}
                      >
                        Morning Physical + Classroom
                      </Select.Option>
                    </Select>
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Highest Qualification *
                    </Text>
                    <Select name="previousQualification" required>
                      <Select.Option value="" selected={!values.previousQualification}>
                        Select qualification...
                      </Select.Option>
                      <Select.Option
                        value="School Student (NMMS)"
                        selected={values.previousQualification === "School Student (NMMS)"}
                      >
                        School Student (NMMS)
                      </Select.Option>
                      <Select.Option
                        value="SSLC (10th)"
                        selected={values.previousQualification === "SSLC (10th)"}
                      >
                        SSLC (10th Standard)
                      </Select.Option>
                      <Select.Option
                        value="HSC (+2) / Diploma"
                        selected={values.previousQualification === "HSC (+2) / Diploma"}
                      >
                        HSC (+2) / ITI / Diploma
                      </Select.Option>
                      <Select.Option
                        value="Undergraduate Degree"
                        selected={values.previousQualification === "Undergraduate Degree"}
                      >
                        Undergraduate Degree
                      </Select.Option>
                      <Select.Option
                        value="Postgraduate / B.Ed"
                        selected={values.previousQualification === "Postgraduate / B.Ed"}
                      >
                        Postgraduate / B.Ed / D.El.Ed
                      </Select.Option>
                    </Select>
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      School / College Name
                    </Text>
                    <Input
                      name="schoolCollegeName"
                      defaultValue={values.schoolCollegeName ?? ""}
                      placeholder="Institution name"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Year of Passing
                    </Text>
                    <Input
                      name="yearOfPassing"
                      defaultValue={values.yearOfPassing ?? ""}
                      placeholder="e.g. 2025"
                    />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Percentage / CGPA
                    </Text>
                    <Input
                      name="marksPercentage"
                      defaultValue={values.marksPercentage ?? ""}
                      placeholder="e.g. 78%"
                    />
                  </label>
                </div>
              </div>

              {/* Section 3: Optional Document Upload & Notes */}
              <div
                mix={[
                  u.vstack({ gap: 4 }),
                  u.pbs(5),
                  u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                  3. Supporting Documents (Optional) &amp; Remarks
                </h2>

                <div
                  mix={[
                    u.grid(),
                    u.gap(4),
                    u.media(
                      "(min-width: 44rem)",
                      u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                    )
                  ]}
                >
                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Passport Size Photo (JPG/PNG, max 5 MB)
                    </Text>
                    <Input name="studentPhoto" type="file" accept=".jpg,.jpeg,.png,.webp" />
                  </label>

                  <label mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Certificate / ID Proof (PDF/JPG, max 5 MB)
                    </Text>
                    <Input
                      name="supportingDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                    />
                  </label>
                </div>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Scholarship Request or Additional Notes
                  </Text>
                  <TextArea
                    name="message"
                    rows={3}
                    defaultValue={values.message ?? ""}
                    placeholder="Mention any previous exam attempts, medium preference (Tamil/English), or scholarship request..."
                  />
                </label>
              </div>

              <div
                mix={[
                  u.hstack({ gap: 3, align: "center", justify: "between" }),
                  u.flexWrap("wrap"),
                  u.pbs(4),
                  u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                  <ShieldCheckIcon size={16} mix={[u.fg("var(--acad-primary)")]} />
                  <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                    Submitted directly to PAART Academy Admissions Office, Puliyangudi.
                  </span>
                </div>
                <Button type="submit" color="brand" variant="solid" size="lg">
                  <SendIcon size={16} aria-hidden="true" />
                  <span>Submit Admission Application</span>
                </Button>
              </div>
            </form>
          </div>
        </AcademicSection>
      </LandingLayout>
    )
  }
}
