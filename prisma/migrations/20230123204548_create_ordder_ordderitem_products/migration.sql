-- CreateTable
CREATE TABLE "ordderItem" (
    "id" SERIAL NOT NULL,
    "ordderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "itemAmount" INTEGER NOT NULL,
    "itemPrice" INTEGER NOT NULL,
    "deliveryStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "COD" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultPrice" INTEGER NOT NULL,
    "height" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "depth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordder" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "deliveryStatus" BOOLEAN NOT NULL DEFAULT false,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_COD_key" ON "products"("COD");

-- AddForeignKey
ALTER TABLE "ordderItem" ADD CONSTRAINT "ordderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordderItem" ADD CONSTRAINT "ordderItem_ordderId_fkey" FOREIGN KEY ("ordderId") REFERENCES "ordder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordder" ADD CONSTRAINT "ordder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordder" ADD CONSTRAINT "ordder_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordder" ADD CONSTRAINT "ordder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
