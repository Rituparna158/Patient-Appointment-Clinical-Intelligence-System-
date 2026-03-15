// import { describe, it, expect, vi, beforeEach } from "vitest";
// import * as notificationService from "../src/services/notification.service";
// import * as notificationRepo from "../src/repositories/notification.repository";
// import { Notification } from "../src/models/external/notification.model";

// interface NotificationResult {
//   total: number;
//   page: number;
//   limit: number;
//   notifications: Notification[];
// }

// describe("notification.service", () => {

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("should return notifications successfully", async () => {

//     const mockNotification: Notification = {
//       id: "notif1",
//       userId: "user1",
//       appointmentId: "appt1",
//       type: "appointment",
//       status: "unread",
//       message: "Appointment confirmed",
//       scheduledAt: new Date(),
//       sentAt: new Date(),
//       createdAt: new Date(),
//       updatedAt: new Date()
//     } as Notification;

//     const mockData: NotificationResult = {
//       total: 1,
//       page: 1,
//       limit: 10,
//       notifications: [mockNotification]
//     };

//     vi.spyOn(notificationRepo, "findUserNotifications")
//       .mockResolvedValue(mockData);

//     const result = await notificationService.getMyNotifications(
//       "user1",
//       1,
//       10
//     );

//     expect(result).toEqual(mockData);
//   });

//   it("should throw error when repository fails", async () => {

//     vi.spyOn(notificationRepo, "findUserNotifications")
//       .mockRejectedValue(new Error("Database error"));

//     await expect(
//       notificationService.getMyNotifications("user1", 1, 10)
//     ).rejects.toThrow("Database error");

//   });

// });
