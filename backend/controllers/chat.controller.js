import llmService from '../services/llm.service.js';
import memoryService from '../services/memory.service.js';
import vectorDBService from '../services/vectordb.service.js';

export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'SessionId is required' });
    }

    const result = await llmService.chat(sessionId, message);

    res.json({
      success: true,
      response: result.response,
      sources: result.sources,
      sessionId
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'SessionId is required' });
    }

    const history = memoryService.getHistory(sessionId);

    res.json({
      success: true,
      sessionId,
      history
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get history',
      details: error.message 
    });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'SessionId is required' });
    }

    const cleared = memoryService.clearHistory(sessionId);

    res.json({
      success: true,
      cleared,
      message: cleared ? 'History cleared' : 'No history found for session'
    });

  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to clear history',
      details: error.message 
    });
  }
};

export const getHealth = async (req, res) => {
  try {
    const count = await vectorDBService.getCollectionCount();
    const sessions = memoryService.getSessionCount();

    res.json({
      success: true,
      status: 'healthy',
      services: {
        vectordb: 'connected',
        llm: 'connected'
      },
      stats: {
        documentsInDB: count,
        activeSessions: sessions
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
};