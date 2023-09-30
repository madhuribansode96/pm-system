-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "features" (
    "id" SERIAL NOT NULL,
    "featureName" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_permissions" (
    "id" SERIAL NOT NULL,
    "featureId" INTEGER NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "feature_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleFeaturePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "featurePermissionId" INTEGER NOT NULL,
    "permission" BOOLEAN NOT NULL,

    CONSTRAINT "RoleFeaturePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_permissions" ADD CONSTRAINT "feature_permissions_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleFeaturePermission" ADD CONSTRAINT "RoleFeaturePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleFeaturePermission" ADD CONSTRAINT "RoleFeaturePermission_featurePermissionId_fkey" FOREIGN KEY ("featurePermissionId") REFERENCES "feature_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
