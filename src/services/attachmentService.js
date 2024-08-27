// @ts-nocheck
const Attachment = require("../models/Attachment");

class AttachmentService {
  static instance = null;

  constructor() {}

  static getInstance() {
    if (!AttachmentService.instance) {
      AttachmentService.instance = new AttachmentService();
    }
    return AttachmentService.instance;
  }

  async updateAttachments({
    taskId,
    commentId,
    entity,
    requestAttachments,
    currentAttachments,
  }) {
    const newAttachments = requestAttachments.filter(
      (url) => !currentAttachments.includes(url)
    );
    const additionPromises = newAttachments.map((url) => {
      return Attachment.create({
        url,
        ...(taskId && { taskId }),
        ...(commentId && { commentId }),
      });
    });

    const attachmentsToRemove = entity.attachments.filter(
      (att) => !requestAttachments.includes(att.url)
    );
    const removalPromises = attachmentsToRemove.map((att) => att.destroy());

    return Promise.all([...additionPromises, ...removalPromises]);
  }
}

module.exports = AttachmentService;
