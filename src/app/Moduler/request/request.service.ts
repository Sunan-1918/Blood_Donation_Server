import httpStatus from "http-status"
import AppError from "../../Error/AppError"
import { TdecodedData } from "../../interface"
import prisma from "../../utility/prismaClient"
import { TdonationRequest } from "./request.interface"
import { requestStatus } from "@prisma/client"

const createDonationRequest = async (decoded: TdecodedData, payload: TdonationRequest) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.donorId
        }
    })

    const data = {
        requesterId: decoded.userId,
        ...payload
    }
    const result = await prisma.request.create({
        data: data
    })

    return result

}

const getDonationRequestion = async (decoded: TdecodedData) => {
    const result = await prisma.request.findMany({
        where: {
            donorId: decoded.userId
        }
    })

    return result

}

const updateDonationRequestion = async (id: string, payload: { status: requestStatus }, decoded: TdecodedData) => {

    const request = await prisma.request.findUniqueOrThrow({
        where: {
            id: id
        }
    })

    if (request.donorId !== decoded.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can't update another donor's request")
    }

    const result = await prisma.request.update({
        where: {
            id: id
        },
        data: {
            requestStatus: payload.status
        }
    })

    return result

}
export const donationService = {
    createDonationRequest,
    getDonationRequestion,
    updateDonationRequestion
}