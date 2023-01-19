import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import httpStatus from "http-status";
import supertest from "supertest";
import authFactory from "../factories/auth-factory";
import userFactory from "../factories/user-factory";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /auth/sign-up", () => {

  it("should respond with status 400 when body is not given", async () => {

    const response = await server.post("/auth/sign-up")
    expect(response.status).toBe(httpStatus.BAD_REQUEST)

  })

  it("should respond with status 400 when email is not valid", async () => {
    
    const invalidBody= {email: 'emailtodoerrado', password:'#minhaSenha123', passwordVerify:'#minhaSenha123'}

    const response = await server.post("/auth/sign-up").send(invalidBody)

    expect(response.status).toBe(httpStatus.BAD_REQUEST)

  })

  it("should respond with status 400 when password is not valid", async () => {
    
    const invalidBody= {email: 'emailtodoerrado', password:'#minhaSenha128', passwordVerify:'#minhaSenha123'}

    const response = await server.post("/auth/sign-up").send(invalidBody)

    expect(response.status).toBe(httpStatus.BAD_REQUEST)

  })

  describe("when credential are valid", () => {

    it("should respond with status 401 when user has already registered with this email", async () => {

      const firstUserValidBody = authFactory.generateValidBody()
      await userFactory.createUser(firstUserValidBody)

      const secondUserValidBody = authFactory.generateValidBody()
      const response = await server.post("/auth/sign-up").send(secondUserValidBody)

      expect(response.status).toBe(httpStatus.CONFLICT)
      
    })

    it("should respond with status 201", async () => {

      const validBody = authFactory.generateValidBody()

      const response = await server.post("/auth/sign-up").send(validBody)

      expect(response.status).toBe(httpStatus.CREATED)
    
    })
  })
});

describe("GET /auth/sign-in", () => {

  it("should respond with status 400 when body is not given", async () => {

  })

  describe("when body is valid", () => {

    it("should respond with status 401 if email is not valid", async () => {

    })

    it("should respond with status 401 if email is valid but password is not correct", async () => {

    })
    
    describe("when credentials are valid", () => {

      it("should respond with status 200", () => {

      })

      it("should respond with user data", () => {
        
      })

      it("should respond with session token", () => {
        
      })
    })
  })
});
