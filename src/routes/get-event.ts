import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
  app 
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: {
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(), 
              attendeesAmount: z.number().int(),
            })
          }
        },
      }
    }, async (req, reply) => {
      const { eventId } = req.params
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          _count: {
            select: {
              attendees: true,
            }
          }
        }
      })

      if(!event) {
        throw new Error("Event not found")
      }

      return reply.send({ 
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          attendeesamount: event._count.attendees,
        } 
      })
    })
}