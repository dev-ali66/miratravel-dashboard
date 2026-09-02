# Database Schema

This file describes the generated Prisma-style database schema for the backend.

> NOTE: This file was generated for reference and should not be modified directly if the schema is generated from a source file.

```
Table Role {
  id String [pk]
  name String [unique, not null]
  permissions Permission [not null]
  users User [not null]
}

Table Permission {
  id String [pk]
  action Action [not null]
  resource String
  scope Scope [not null]
  roles Role [not null]
}

Table Session {
  id String [pk]
  userId String [not null]
  refreshTokenHash String [not null]
  tokenFamily String [not null]
  deviceName String
  userAgent String
  ipAddress String
  fingerprintHash String
  isRevoked Boolean [not null, default: false]
  revokeReason String
  expiresAt DateTime [not null]
  lastUsedAt DateTime
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  user User [not null]
}

Table Beach {
  id String [pk]
  name String [unique, not null]
  tag String
  slug String [unique]
  beachImage String[] [not null]
  description String
  isPublished Boolean [not null, default: true]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  instructor InstructorInfo [not null]
  leads Lead [not null]
  beachPage BeachPage [not null]
  reviews Reviews [not null]
}

Table BeachPage {
  id String [pk]
  beachId String [not null]
  order Int
  slug String
  page String
  title String
  data Json [not null]
  isPublished Boolean [not null, default: true]
  beach Beach [not null]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]

  indexes {
    (beachId, slug) [unique]
    (order, beachId) [unique]
  }
}

Table Cms {
  id String [pk]
  slug String [unique, not null]
  data Json [not null]
  isPublished Boolean [not null, default: true]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
}

Table CreditPackage {
  id String [pk]
  credits Int [not null]
  bonus Int [not null, default: 0]
  price Int [not null]
  popular Boolean [not null, default: false]
  isActive Boolean [not null, default: true]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  creditPurchases CreditPurchase [not null]
}

Table CreditPurchase {
  id String [pk]
  userId String [not null]
  packageId String [not null]
  status String [not null]
  price Int [not null, default: 0]
  transactionId String
  user User [not null]
  package CreditPackage [not null]
  createdAt DateTime [default: `now()`, not null]
}

Table InstructorInfo {
  id String [pk]
  userId String [unique, not null]
  skill SkillLevel [not null, default: 'BEGINNER']
  experience String
  license String[] [not null]
  languages String[] [not null]
  preferredTime String [not null, default: 'MORNING']
  free_lead_used Boolean [not null, default: false]
  creditBalance Int [not null, default: 5]
  open_pending_leads Int [not null, default: 0]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  user User [not null]
  beach Beach [not null]
  leads Lead [not null]
  reviews Reviews [not null]
}

Table Lead {
  id String [pk]
  turistId String [not null]
  instructorId String
  beachId String [not null]
  whatsapp String
  message String
  skillLevel SkillLevel [not null, default: 'BEGINNER']
  preferredDate DateTime
  preferredTime String
  status LeadStatus [not null, default: 'PENDING']
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  turistInfo TuristInfo
  instructorInfo InstructorInfo
  beach Beach [not null]
  reviews Reviews
}

Table Pages {
  id String [pk]
  name String [unique, not null]
  slug String [unique, not null]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  pagesSections PagesSection [not null]
}

Table PagesSection {
  id String [pk]
  pageId String [not null]
  pageName String [not null, default: '']
  slug String [unique, not null]
  order Int
  title String
  key String
  data Json [not null]
  isPublished Boolean [not null, default: false]
  pages Pages [not null]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]

  indexes {
    (pageId, slug) [unique]
  }
}

Table Reviews {
  id String [pk]
  rating Int [not null]
  comment String
  leadId String [unique, not null]
  beachId String [not null]
  turistId String [not null]
  instructorId String [not null]
  lead Lead [not null]
  beach Beach [not null]
  turistInfo TuristInfo
  instructorInfo InstructorInfo
  createdAt DateTime [default: `now()`, not null]
}

Table TuristInfo {
  id String [pk]
  userId String [unique, not null]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  user User [not null]
  leads Lead [not null]
  reviews Reviews [not null]
}

Table User {
  id String [pk]
  email String [unique, not null]
  password String [not null]
  isVerified Boolean [not null, default: false]
  status Status [not null, default: 'ACTIVE']
  otp String
  otpExpiresAt DateTime
  passwordResetToken String
  passwordResetExpiresAt DateTime
  emailToken String
  failedLoginAttempts Int [not null, default: 0]
  lockUntil DateTime
  isDeleted Boolean [not null, default: false]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  sessions Session [not null]
  roles Role [not null]
  instructorInfo InstructorInfo
  turistInfo TuristInfo
  userPersonalInfo UserPersonalInfo
  userSettings UserSettings
  creditPurchases CreditPurchase [not null]
}

Table UserSettings {
  id String [pk]
  userId String [unique, not null]
  emailNotification Boolean [not null, default: true]
  whatsappNotification Boolean [not null, default: false]
  platfromNotification Boolean [not null, default: true]
  smsNotification Boolean [not null, default: false]
  orderNotification Boolean [not null, default: true]
  orderStatusNotification Boolean [not null, default: true]
  platfromUpdateNotification Boolean [not null, default: true]
  createdAt DateTime [default: `now()`, not null]
  updatedAt DateTime [not null]
  user User [not null]
}

Table UserPersonalInfo {
  id String [pk]
  userId String [unique, not null]
  firstName String
  lastName String
  about String
  photoUrl String[] [not null]
  bgPhotoUrl String[] [not null]
  phone String
  whatsapp String
  isWhatsappVerified Boolean [not null, default: false]
  otp String
  otpExpiresAt DateTime
  user User [not null]
}

Table PermissionToRole {
  permissionsId String [ref: > Permission.id]
  rolesId String [ref: > Role.id]
}

Table RoleToUser {
  usersId String [ref: > User.id]
  rolesId String [ref: > Role.id]
}

Table BeachToInstructorInfo {
  instructorId String [ref: > InstructorInfo.id]
  beachId String [ref: > Beach.id]
}

Enum Action {
  CREATE
  READ
  UPDATE
  DELETE
}

Enum Scope {
  OWN
  ANY
  OTHER
}

Enum Status {
  ACTIVE
  INACTIVE
  DEACTIVE
  BLOCKED
  SUSPENDED
  PENDING
  DELETED
  ARCHIVED
}

Enum LeadStatus {
  PENDING
  ACCEPTED
  EXPIRED
  DECLINED
}

Enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

Ref: Session.userId > User.id [delete: Cascade]

Ref: BeachPage.beachId > Beach.id [delete: Cascade]

Ref: CreditPurchase.userId > User.id

Ref: CreditPurchase.packageId > CreditPackage.id

Ref: InstructorInfo.userId - User.id [delete: Cascade]

Ref: Lead.turistId > TuristInfo.id

Ref: Lead.instructorId > InstructorInfo.id

Ref: Lead.beachId > Beach.id

Ref: PagesSection.pageId > Pages.id [delete: Cascade]

Ref: Reviews.leadId - Lead.id

Ref: Reviews.beachId > Beach.id

Ref: Reviews.turistId > TuristInfo.id

Ref: Reviews.instructorId > InstructorInfo.id

Ref: TuristInfo.userId - User.id [delete: Cascade]

Ref: UserSettings.userId - User.id [delete: Cascade]

Ref: UserPersonalInfo.userId - User.id [delete: Cascade]
```
