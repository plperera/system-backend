import faker from "@faker-js/faker";
import { prisma } from "@/config";

//create ticket valid and invalid
export function createHotel() {
  const hotelName = faker.animal.lion();

  return prisma.hotel.create({
    data: {
      name: hotelName,
      image: "https://blog.maxmilhas.com.br/wp-content/uploads/2016/01/pr%C3%A9dio-de-hotel.jpg"
    }
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.vehicle.vrm(),
      capacity: faker.datatype.number({ min: 1, max: 3 }),
      hotelId,
    },
  });
}
      
