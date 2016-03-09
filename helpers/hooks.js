// @flow

const saveInSession = (session: any, data: ?any) => Object.assign(session, data);

const saveFormData = (req: any, res: any, next: any) => {
  process.nextTick(() => {
    saveInSession(req.session, {
      initBody: req.body,
      requestType: req.url.substring(1),
    });
    next();
  });
};

export default saveFormData;
